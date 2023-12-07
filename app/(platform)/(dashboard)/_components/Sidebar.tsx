"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization } from "@clerk/nextjs";
import { useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import type { Organization } from "./NavItem";
import { NavItem } from "./NavItem";

interface SidebarProps {
    /**
     * Будет использоваться для аккордеона.
     * После ререндера аккордеон обычно сворачивается.
     * Чтобы этого не происходило, будем запоминать в localStorage storageKey
     */
    storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
    /**
     * useLocalStorage работает похожим образом, что и useState.
     * Только идет запись и чтение из localStorage.
     */
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
        storageKey,
        {}
    );
    /**
     * Так будет выглядеть этот объект в localStorage:
     * { "my-org-id-123": true }
     */

    const { organization: activeOrganization, isLoaded: isLoadedOrg } =
        useOrganization();

    const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
        userMemberships: {
            /**
             * https://clerk.com/docs/references/react/use-organization-list#commonpaginatedparams
             * Если true, то новые загруженные данные будут добавлены в список организаций (новые организации).
             * Идеально для бесконечных списков.
             */
            infinite: true,
        },
    });

    /**
     * Здесь получаем id активных организаций
     * (см. выше) как записываются данные в localStorage
     *
     * Из объекта вида:
     * { "my-org-id-123": true, "another-org-id": false }
     * Получаем:
     * ["my-org-id-123"]
     */
    const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
        (acc: string[], key: string) => {
            if (expanded[key]) {
                acc.push(key);
            }
            return acc;
        },
        []
    );

    const onExpand = (id: string) => {
        setExpanded((curr) => ({
            ...curr,
            [id]: !expanded[id],
        }));
    };

    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <>
                <Skeleton />
            </>
        );
    }

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspaces</span>
                <Button
                    asChild
                    type="button"
                    size={"icon"}
                    variant={"ghost"}
                    className="ml-auto"
                >
                    <Link href={"/select-org"}>
                        <Plus className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                className="space-y-2"
            >
                {userMemberships.data.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrganization?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization as Organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    );
};