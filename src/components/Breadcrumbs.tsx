import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbItemProps = {
  name?: string;
  href?: string;
  icon?: React.ReactNode;
};

type BreadcrumbsProps = {
  items: BreadcrumbItemProps[];
  linkClassName?: string;
  pageClassName?: string;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, linkClassName, pageClassName }) => {
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink
                    href={item.href}
                    className={`text-xs lg:text-sm ${linkClassName} hover:text-text`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className={`text-xs lg:text-sm font-semibold ${pageClassName}`}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
