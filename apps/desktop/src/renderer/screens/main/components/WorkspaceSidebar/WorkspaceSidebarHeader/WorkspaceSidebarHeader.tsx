import { NewWorkspaceButton } from "./NewWorkspaceButton";

interface WorkspaceSidebarHeaderProps {
	isCollapsed?: boolean;
}

export function WorkspaceSidebarHeader({
	isCollapsed = false,
}: WorkspaceSidebarHeaderProps) {
	if (isCollapsed) {
		return (
			<div className="flex flex-col items-center border-b border-border py-2 gap-2">
				<NewWorkspaceButton isCollapsed />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1 border-b border-border px-2 pt-2 pb-2">
			<NewWorkspaceButton />
		</div>
	);
}
