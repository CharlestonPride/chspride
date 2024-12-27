import { Theme } from "@/sanity/lib/sanity.types";
import {
  IconLookup,
  IconDefinition,
  findIconDefinition,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type IconProps = {
  theme: Theme;
  icon: IconName;
};

export default function RoundShadowIcon(props: IconProps) {
  return <></>;
  // const lookup: IconLookup = { prefix: "fas", iconName: props.icon };
  // const iconDefinition: IconDefinition = findIconDefinition(lookup);
  // if (!iconDefinition) {
  //   return <div>Icon not found</div>;
  // }
  // return (
  //   <div
  //     className={
  //       "icon icon-shape text-white rounded-circle shadow text-center mb-2 bg-gradient-" +
  //       props.theme
  //     }
  //   >
  //     <FontAwesomeIcon icon={iconDefinition} size="lg" />
  //   </div>
  // );
}
