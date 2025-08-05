"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- Icons (lucide-react) ---
import {
    Activity,
    Bell,
    BookOpen,
    Bus,
    Calendar,
    ChartBar,
    ClipboardCheck,
    ClipboardList,
    DollarSign,
    FileText,
    GraduationCap,
    Home,
    Inbox,
    Layers,
    LifeBuoy,
    Library as LibraryIcon,
    Search,
    Settings,
    ShieldCheck,
    UserCog,
    Users,
    ChevronDown,
    ChevronRight,
    ChartBarBig,
} from "lucide-react";

// --- shadcn/ui primitives ---
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

/* ------------------------------------------------------------------
 * NAVIGATION DATA TREE (relative paths)
 * NOTE: These `url` values are *section-relative* and will be resolved
 * to fully-qualified app paths (e.g., "/secured/application/dashboard")
 * inside <AppSidebar />.
 * ------------------------------------------------------------------ */
export type NavNode = {
    title: string;
    url?: string; // relative URL (leading slash from module root)
    icon?: React.ComponentType<{ className?: string }>;
    items?: NavNode[];
    badge?: string | number;
};

export const NAV_TREE: NavNode[] = [
    {
        title: "Application",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: Home },
            { title: "Inbox", url: "/inbox", icon: Inbox },
            { title: "Calendar", url: "/calendar", icon: Calendar },
            { title: "Global Search", url: "/search", icon: Search },
            { title: "Notifications", url: "/notifications", icon: Bell },
        ],
    },
    {
        title: "Academics",
        items: [
            { title: "Batch", url: "/academics/batch", icon: ChartBarBig },
            { title: "Admissions", url: "/academics/admissions", icon: ClipboardList },
            { title: "Students", url: "/academics/students", icon: Users },
            { title: "Classes & Sections", url: "/academics/classes", icon: Layers },
            { title: "Subjects & Curriculum", url: "/academics/subjects", icon: BookOpen },
            { title: "Timetable", url: "/academics/timetable", icon: Calendar },
            { title: "Attendance", url: "/academics/attendance", icon: ClipboardCheck },
            { title: "Assignments/Homework", url: "/academics/assignments", icon: FileText },
            { title: "Lesson Plans", url: "/academics/lesson-plans", icon: GraduationCap },
        ],
    },
    {
        title: "Exams & Grades",
        items: [
            { title: "Exam Setup", url: "/exams/setup", icon: ClipboardList },
            { title: "Exam Schedule", url: "/exams/schedule", icon: Calendar },
            { title: "Exam Attendance", url: "/exams/attendance", icon: ClipboardCheck },
            { title: "Marks Entry", url: "/exams/marks-entry", icon: FileText },
            { title: "Report Cards", url: "/exams/report-cards", icon: Activity },
            { title: "Transcripts", url: "/exams/transcripts", icon: FileText },
        ],
    },
    {
        title: "Finance & Fees",
        items: [
            { title: "Fee Structures", url: "/finance/fee-structures", icon: DollarSign },
            { title: "Fee Collection", url: "/finance/fee-collection", icon: DollarSign },
            { title: "Scholarships & Discounts", url: "/finance/scholarships", icon: DollarSign },
            { title: "Expenses", url: "/finance/expenses", icon: FileText },
            { title: "Accounting", url: "/finance/accounting", icon: ChartBar },
            { title: "Financial Reports", url: "/finance/reports", icon: ChartBar },
        ],
    },
    {
        title: "HR & Payroll",
        items: [
            { title: "Staff Directory", url: "/hr/staff", icon: Users },
            { title: "Staff Attendance", url: "/hr/attendance", icon: ClipboardCheck },
            { title: "Leaves", url: "/hr/leaves", icon: Calendar },
            { title: "Payroll", url: "/hr/payroll", icon: DollarSign },
            { title: "Performance", url: "/hr/performance", icon: Activity },
        ],
    },
    {
        title: "Communication",
        items: [
            { title: "Messages", url: "/communication/messages", icon: Inbox },
            { title: "Announcements", url: "/communication/announcements", icon: Bell },
            { title: "Email / SMS", url: "/communication/email-sms", icon: Inbox },
            { title: "Push Notifications", url: "/communication/push", icon: Bell },
            { title: "Parent Portal", url: "/communication/parent-portal", icon: Users },
        ],
    },
    {
        title: "LMS / e-Learning",
        items: [
            { title: "Courses", url: "/lms/courses", icon: GraduationCap },
            { title: "Content Library", url: "/lms/content", icon: LibraryIcon },
            { title: "Assessments", url: "/lms/assessments", icon: ClipboardList },
            { title: "Live Classes", url: "/lms/live", icon: Activity },
        ],
    },
    {
        title: "Library",
        items: [
            { title: "Catalogue", url: "/library/catalogue", icon: LibraryIcon },
            { title: "Issue / Return", url: "/library/issue-return", icon: ClipboardCheck },
            { title: "Reservations", url: "/library/reservations", icon: Calendar },
            { title: "Fines", url: "/library/fines", icon: DollarSign },
            { title: "Stock Audit", url: "/library/stock-audit", icon: ChartBar },
        ],
    },
    {
        title: "Transport",
        items: [
            { title: "Routes", url: "/transport/routes", icon: Bus },
            { title: "Vehicles", url: "/transport/vehicles", icon: Bus },
            { title: "Drivers", url: "/transport/drivers", icon: Users },
            { title: "GPS Tracking", url: "/transport/tracking", icon: Activity },
        ],
    },
    {
        title: "Hostel",
        items: [
            { title: "Rooms", url: "/hostel/rooms", icon: Layers },
            { title: "Allocation", url: "/hostel/allocation", icon: ClipboardCheck },
            { title: "Mess & Meals", url: "/hostel/mess", icon: FileText },
            { title: "Hostel Attendance", url: "/hostel/attendance", icon: ClipboardCheck },
        ],
    },
    {
        title: "Inventory & Assets",
        items: [
            { title: "Stores", url: "/inventory/stores", icon: Layers },
            { title: "Purchase Orders", url: "/inventory/purchase-orders", icon: FileText },
            { title: "Stock In / Out", url: "/inventory/stock", icon: ClipboardList },
            { title: "Issue / Return", url: "/inventory/issue-return", icon: ClipboardCheck },
            { title: "Maintenance", url: "/inventory/maintenance", icon: Activity },
        ],
    },
    {
        title: "Reports & Analytics",
        items: [
            { title: "KPIs Dashboard", url: "/reports/kpis", icon: ChartBar },
            { title: "Custom Reports", url: "/reports/custom", icon: FileText },
            { title: "Data Export", url: "/reports/export", icon: FileText },
        ],
    },
    {
        title: "System Admin",
        items: [
            { title: "Users", url: "/admin/users", icon: Users },
            { title: "Roles & Permissions", url: "/admin/roles", icon: ShieldCheck },
            { title: "Institute Settings", url: "/admin/settings", icon: Settings },
            { title: "Integrations", url: "/admin/integrations", icon: UserCog },
            { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
            { title: "Backups", url: "/admin/backups", icon: LifeBuoy },
        ],
    },
];

/* ------------------------------------------------------------------
 * CONFIG: Path bases
 * ------------------------------------------------------------------ */
// Everything lives under /secured
const SECURED_BASE = "/secured";
// "Application" section specifically lives under /secured/application
const APPLICATION_BASE = "/secured/application";

/** Join two URL fragments safely (dedupe slashes). */
function joinPath(base: string, path: string) {
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${b}${p}`.replace(/\/{2,}/g, "/");
}

/** Resolve a section item to its full app URL. */
function resolveSectionItemUrl(sectionTitle: string, relUrl?: string) {
    if (!relUrl) return undefined;
    if (sectionTitle === "Application") {
        return joinPath(APPLICATION_BASE, relUrl);
    }
    // All other sections: prepend /secured
    return joinPath(SECURED_BASE, relUrl);
}

/* ------------------------------------------------------------------
 * HOOK: Check active path (normalized)
 * ------------------------------------------------------------------ */
function useActivePath() {
    const pathname = usePathname();
    return React.useCallback(
        (url?: string) => {
            if (!url) return false;
            const norm = (s: string) => (s.length > 1 ? s.replace(/\/+$/, "") : s);
            const p = norm(pathname);
            const u = norm(url);
            return p === u || p.startsWith(u + "/");
        },
        [pathname]
    );
}

/* ------------------------------------------------------------------
 * NavLeaf: A single leaf link
 * ------------------------------------------------------------------ */
interface NavLeafProps {
    node: NavNode;
}
function NavLeaf({ node }: NavLeafProps) {
    const isActivePath = useActivePath();
    const Icon = node.icon;
    const active = isActivePath(node.url);

    return (
        <SidebarMenuButton asChild isActive={active}>
            <Link
                href={node.url ?? "#"}
                className={`flex items-center w-full ${active
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                    : ""
                    }`}
            >
                {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                <span>{node.title}</span>
                {node.badge && (
                    <span className="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs leading-none text-primary-foreground">
                        {node.badge}
                    </span>
                )}
            </Link>
        </SidebarMenuButton>
    );
}

/* ------------------------------------------------------------------
 * NavItemNode: Parent group or single item
 * (This handles *nested groups* if you add deeper trees later.)
 * ------------------------------------------------------------------ */
interface NavItemNodeProps {
    node: NavNode;
}
function NavItemNode({ node }: NavItemNodeProps) {
    const isActivePath = useActivePath();
    const hasChildren = !!(node.items && node.items.length > 0);
    const Icon = node.icon;

    if (hasChildren) {
        const anyChildActive = node.items?.some((c) => isActivePath(c.url));
        const [open, setOpen] = React.useState(anyChildActive);

        // Open when any child becomes active (route change)
        React.useEffect(() => {
            if (anyChildActive) setOpen(true);
        }, [anyChildActive]);

        return (
            <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
                <SidebarMenuButton asChild>
                    <CollapsibleTrigger asChild>
                        <button
                            className={`w-full flex items-center ${anyChildActive ? "text-primary font-semibold" : ""
                                }`}
                        >
                            {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                            <span>{node.title}</span>
                        </button>
                    </CollapsibleTrigger>
                </SidebarMenuButton>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {node.items?.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                                <NavLeaf node={sub} />
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    // Plain leaf
    return <NavLeaf node={node} />;
}

/* ------------------------------------------------------------------
 * MAIN SIDEBAR COMPONENT
 * ------------------------------------------------------------------ */
export function AppSidebar() {
    const isActivePath = useActivePath();
    const pathname = usePathname();

    // Build a resolved tree with fully-qualified URLs
    const resolvedTree = React.useMemo<NavNode[]>(() => {
        return NAV_TREE.map((section) => ({
            ...section,
            items: section.items?.map((item) => ({
                ...item,
                url: resolveSectionItemUrl(section.title, item.url),
            })),
        }));
    }, []);

    // Track user toggles but always force-open the active section
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

    // On route change, ensure the active section is opened
    React.useEffect(() => {
        const next: Record<string, boolean> = {};
        resolvedTree.forEach((section) => {
            const active = section.items?.some((i) => isActivePath(i.url)) ?? false;
            if (active) {
                next[section.title] = true;
            }
        });
        setOpenSections((prev) => ({ ...prev, ...next }));
    }, [pathname, resolvedTree, isActivePath]);

    const handleToggle = (title: string, value: boolean) => {
        setOpenSections((prev) => ({ ...prev, [title]: value }));
    };

    return (
        <Sidebar>
            <SidebarContent className="m-4">
                {resolvedTree.map((section) => {
                    const sectionActive =
                        section.items?.some((item) => isActivePath(item.url)) ?? false
                    const open = openSections[section.title] ?? sectionActive

                    return (
                        <Collapsible
                            key={section.title}
                            open={open}
                            onOpenChange={(v) => handleToggle(section.title, v)}
                            className="group/collapsible"
                        >
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={`cursor-pointer font-semibold flex items-center justify-between w-full ${sectionActive ? "text-primary" : ""
                                                }`}
                                        >
                                            {section.title}
                                            <span className="ml-auto">
                                                {open ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </span>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {section.items?.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <NavItemNode node={item} />
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </Collapsible>
                    )
                })}
            </SidebarContent>
        </Sidebar>

    );
}
