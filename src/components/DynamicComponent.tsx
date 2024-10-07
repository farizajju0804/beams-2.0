// Assuming you already have this component
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';

const iconLibraries: any = {
  fa: FaIcons,
  md: MdIcons,
  gi: GiIcons,
  ai: AiIcons
};

export const DynamicIcon = ({ icon, ...props }: any) => {
  let  IconComponent
  if(icon){
    const [library, iconName]: any = icon.split('/');
    IconComponent = iconLibraries[library]?.[iconName];
  }


  if (!IconComponent) {
    console.error(`Icon not found: ${icon}`);
    return <div style={{ width: props.size, height: props.size }}></div>;
  }

  return <IconComponent {...props} />;
};
