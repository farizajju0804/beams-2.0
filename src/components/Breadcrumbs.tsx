import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'iconsax-react';

type BreadcrumbItemProps = {
  name?: string;
  href?: string;
  icon?: React.ReactNode;
};

type BreadcrumbsProps = {
  items: BreadcrumbItemProps[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink
                    href={item.href}
                    className={`text-xs text-grey-2 lg:text-sm  hover:text-text`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-text font-semibold text-xs lg:text-sm">
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
