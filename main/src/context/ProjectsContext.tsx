"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  name: string;
  email: string;
  message: string;
  createdAt: number;
};

export type NewProject = Omit<Project, "id" | "createdAt">;
export type NewApplication = Omit<Application, "id" | "projectId" | "createdAt">;

const PROJECTS_KEY = "ishvarax.projects";
const APPS_KEY = "ishvarax.applications";

// Seed content so the home page has something before an admin adds projects.
const seedProjects: Project[] = [
  {
    id: "seed-pinaka-eeg",
    title: "EEG Signal Visualizer",
    description:
      "Build an interactive dashboard that renders EEG/brainwave streams with React and WebGL. A fun project to learn data visualization with the community.",
    skills: ["React", "TypeScript", "WebGL", "Data Viz"],
    duration: "Flexible",
    status: "open",
    createdAt: Date.now(),
  },
];

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type ProjectsContextValue = {
  projects: Project[];
  applications: Application[];
  isReady: boolean;
  latestProject: Project | null;
  addProject: (data: NewProject) => Project;
  deleteProject: (id: string) => void;
  applyToProject: (projectId: string, data: NewApplication) => void;
  applicationsFor: (projectId: string) => Application[];
};

const ProjectsContext = createContext<ProjectsContextValue | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setProjects(readStore<Project[]>(PROJECTS_KEY, seedProjects));
    setApplications(readStore<Application[]>(APPS_KEY, []));
    setIsReady(true);
  }, []);

  const persistProjects = useCallback((next: Project[]) => {
    setProjects(next);
    writeStore(PROJECTS_KEY, next);
  }, []);

  const persistApplications = useCallback((next: Application[]) => {
    setApplications(next);
    writeStore(APPS_KEY, next);
  }, []);

  const addProject = useCallback(
    (data: NewProject) => {
      const project: Project = {
        ...data,
        id: makeId(),
        createdAt: Date.now(),
      };
      persistProjects([project, ...projects]);
      return project;
    },
    [projects, persistProjects]
  );

  const deleteProject = useCallback(
    (id: string) => {
      persistProjects(projects.filter((p) => p.id !== id));
      persistApplications(applications.filter((a) => a.projectId !== id));
    },
    [projects, applications, persistProjects, persistApplications]
  );

  const applyToProject = useCallback(
    (projectId: string, data: NewApplication) => {
      const application: Application = {
        ...data,
        id: makeId(),
        projectId,
        createdAt: Date.now(),
      };
      persistApplications([application, ...applications]);
    },
    [applications, persistApplications]
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
