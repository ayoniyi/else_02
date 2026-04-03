// Example usage of the NewNav component
import NewNav from "@/components/NewNav";

// Basic usage with default props
export const BasicNav = () => {
  return <NewNav />;
};

// Custom usage with your own menu items
export const CustomNav = () => {
  return (
    <NewNav
      logo="else"
      ctaText="Start"
      ctaHref="/start"
      leftMenuLinks={[
        { href: "/theory", label: "Theory" },
        { href: "/companies", label: "Companies" },
        { href: "/perspectives", label: "Perspectives" },
        { href: "/team", label: "Team" },
        { href: "/portfolio", label: "Portfolio" },
      ]}
      rightMenuLinks={[
        { href: "/about", label: "About" },
        { href: "/work", label: "Work" },
        { href: "/contact", label: "Contact" },
        { href: "/blog", label: "Blog" },
        { href: "/resources", label: "Resources" },
      ]}
      footerLinks={[
        { href: "/terms", label: "Terms" },
        { href: "/privacy", label: "Privacy" },
        { href: "/cookies", label: "Cookies" },
      ]}
      copyright="© 2025 else"
    />
  );
};
