import { and, eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { useEffect } from "react";
import { env } from "renderer/env.renderer";
import { authClient } from "renderer/lib/auth-client";
import { useDashboardSidebarState } from "renderer/routes/_authenticated/hooks/useDashboardSidebarState";
import { useCollections } from "renderer/routes/_authenticated/providers/CollectionsProvider";
import { MOCK_ORG_ID } from "shared/constants";

const SEED_FLAG_KEY = "superset:dev:v2-sidebar-seeded";

/**
 * Auto-pins accessible v2 workspaces in dev so a fresh worktree's sidebar
 * isn't blank. Chromium's localStorage is per-origin: the dev Vite origin
 * (`http://localhost:<port>`) can't share data with the packaged `file://`
 * origin, so copying prod's leveldb seeds the wrong namespace. We pin at
 * runtime instead. The flag prevents re-pinning workspaces the user later
 * unpins.
 */
export function useDevSeedV2Sidebar(): void {
	const collections = useCollections();
	const { ensureWorkspaceInSidebar } = useDashboardSidebarState();
	const { data: session } = authClient.useSession();
	const activeOrganizationId = env.SKIP_ENV_VALIDATION
		? MOCK_ORG_ID
		: (session?.session?.activeOrganizationId ?? null);
	const currentUserId = session?.user?.id ?? null;

	const { data: workspaceRows = [] } = useLiveQuery(
		(q) =>
			q
				.from({ workspaces: collections.v2Workspaces })
				.innerJoin({ hosts: collections.v2Hosts }, ({ workspaces, hosts }) =>
					eq(workspaces.hostId, hosts.machineId),
				)
				.innerJoin(
					{ userHosts: collections.v2UsersHosts },
					({ hosts, userHosts }) => eq(userHosts.hostId, hosts.machineId),
				)
				.where(({ workspaces, userHosts }) =>
					and(
						eq(workspaces.organizationId, activeOrganizationId ?? ""),
						eq(userHosts.userId, currentUserId ?? ""),
					),
				)
				.select(({ workspaces }) => ({
					id: workspaces.id,
					projectId: workspaces.projectId,
				})),
		[activeOrganizationId, collections, currentUserId],
	);

	useEffect(() => {
		if (env.NODE_ENV !== "development") return;
		if (window.localStorage.getItem(SEED_FLAG_KEY) === "1") return;
		if (workspaceRows.length === 0) return;
		if (collections.v2WorkspaceLocalState.state.size > 0) {
			window.localStorage.setItem(SEED_FLAG_KEY, "1");
			return;
		}

		for (const workspace of workspaceRows) {
			ensureWorkspaceInSidebar(workspace.id, workspace.projectId);
		}
		window.localStorage.setItem(SEED_FLAG_KEY, "1");
	}, [workspaceRows, collections, ensureWorkspaceInSidebar]);
}
