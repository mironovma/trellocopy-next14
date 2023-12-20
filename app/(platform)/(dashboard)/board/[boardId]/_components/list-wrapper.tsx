interface ListWrapperProps {
    children: React.ReactNode;
}

export const ListWrapper = ({ children }: ListWrapperProps) => {
    return (
        <li className="flex-shrink-0 h-full w-[272px] select-none">
            {children}
        </li>
    );
};
