"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]" />
                    <Skeleton className="h-10 w-10" />
                </div>
                {/**
                 * Чтобы руками не переписывать каждый раз новую структуру,
                 * можно прямо в компоненте создавать вложенный компонент.
                 * См. NavItem внизу. Очень удобно.
                 */}
                <div className="space-y-2">
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                </div>
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
