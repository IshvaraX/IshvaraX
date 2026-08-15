"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  projectsApi,
  type ApplicationDTO,
  type ProjectDTO,
} from "@/lib/api";

export type Project = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  stipend?: string;
  duration?: string;
  status: "open" | "closed";
  createdAt: number;
};

export type Application = {
  id: string;
  projectId: string;
  username: string;
  links: string;
  createdAt: number;
  email?: string;
  skills?: string[];
  language?: string;
  photo?: string;
};

export type NewProject = Omit<Project, "id" | "createdAt">;
export type NewApplication = Omit<Application, "id" | "projectId" | "createdAt">;

function normalizeProject(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    skills: dto.skills ?? [],
    stipend: dto.stipend ?? undefined,
    duration: dto.duration ?? undefined,
    status: dto.status,
    createdAt: dto.createdAt,
  };
}

function normalizeApplication(dto: ApplicationDTO): Application {
  return {
    id: dto.id,
    projectId: dto.projectId,
    username: dto.username,
    links: dto.links,
    createdAt: dto.createdAt,
    email: dto.email ?? undefined,
    skills: dto.skills ?? [],
    language: dto.language ?? undefined,
    photo: dto.photo ?? undefined,
  };
}

type ProjectsContextValue = {
  projects: Project[];
  applications: Application[];
  isReady: boolean;
  latestProject: Project | null;
  refresh: () => Promise<void>;
  refreshApplications: (adminPassword: string) => Promise<void>;
  addProject: (data: NewProject, adminPassword: string) => Promise<Project>;
  deleteProject: (id: string, adminPassword: string) => Promise<void>;
  applyToProject: (projectId: string, data: NewApplication) => Promise<Application>;
  applicationsFor: (projectId: string) => Application[];
};

const ProjectsContext = createContext<ProjectsContextValue | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await projectsApi.list();
      setProjects(list.map(normalizeProject));
    } catch {
      // Leave the current list in place if the backend is unreachable.
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const refreshApplications = useCallback(async (adminPassword: string) => {
    const list = await projectsApi.listApplications(adminPassword);
    setApplications(list.map(normalizeApplication));
  }, []);

  const addProject = useCallback(
    async (data: NewProject, adminPassword: string) => {
      const created = await projectsApi.create(
        {
          title: data.title,
          description: data.description,
          skills: data.skills,
          stipend: data.stipend,
          duration: data.duration,
          status: data.status,
        },
        adminPassword
      );
      const project = normalizeProject(created);
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    []
  );

  const deleteProject = useCallback(
    async (id: string, adminPassword: string) => {
      await projectsApi.remove(id, adminPassword);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setApplications((prev) => prev.filter((a) => a.projectId !== id));
    },
    []
  );

  const applyToProject = useCallback(
    async (projectId: string, data: NewApplication) => {
      const created = await projectsApi.apply(projectId, {
        username: data.username,
        links: data.links,
      });
      const application = normalizeApplication(created);
      setApplications((prev) => [application, ...prev]);
      return application;
    },
    []
  );

  const applicationsFor = useCallback(
    (projectId: string) => applications.filter((a) => a.projectId === projectId),
    [applications]
  );

  const latestProject = useMemo(() => {
    if (projects.length === 0) return null;
    return [...projects].sort((a, b) => b.createdAt - a.createdAt)[0];
  }, [projects]);

  const value = useMemo(
    () => ({
      projects,
      applications,
      isReady,
      latestProject,
      refresh,
      refreshApplications,
      addProject,
      deleteProject,
      applyToProject,
      applicationsFor,
    }),
    [
      projects,
      applications,
      isReady,
      latestProject,
      refresh,
      refreshApplications,
      addProject,
      deleteProject,
      applyToProject,
      applicationsFor,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return ctx;
}
