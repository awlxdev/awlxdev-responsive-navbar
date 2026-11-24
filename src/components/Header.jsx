import { useEffect, useRef, useState } from "react";
import "./Header.css";

const navigation = [
  { label: "Beranda", href: "#home" },
  {
    label: "Layanan",
    href: "#services",
    dropdown: [
      { label: "Pengembangan Web", description: "Website dan aplikasi modern", href: "#web-development" },
      { label: "Desain UI/UX", description: "Pengalaman digital yang menarik", href: "#ui-ux" },
      { label: "Sistem Informasi", description: "Solusi cerdas untuk bisnis", href: "#information-systems" },
      { label: "Solusi Digital", description: "Teknologi untuk kemajuan Anda", href: "#digital-solutions" },
    ],
  },
  { label: "Portofolio", href: "#portfolio" },
  { label: "Tentang Kami", href: "#about" },
  {
    label: "Jelajahi",
    href: "#explore",
    dropdown: [
      { label: "Wawasan", description: "Ide, tren, dan perspektif", href: "#insights" },
      { label: "Tanya Jawab", description: "Pertanyaan yang sering diajukan", href: "#faq" },
      { label: "Karier", description: "Berkembang bersama tim kami", href: "#careers" },
    ],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 15.5 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`chevron-icon ${open ? "rotated" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState("#home");
  const headerRef = useRef(null);

  // DROPDOWN AUTO POSITION
  const dropdownTriggerRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const [dropdownPlacement, setDropdownPlacement] = useState("down");
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(null);

  useEffect(() => {
    const sectionIds = [
      "home",
      "services",
      "portfolio",
      "about",
      "insights",
      "faq",
      "careers",
      "contact",
    ];

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const visibleSections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .filter((section) => section.getBoundingClientRect().top <= 170);

      if (visibleSections.length > 0) {
        setActiveLink(`#${visibleSections[visibleSections.length - 1].id}`);
      } else {
        setActiveLink("#home");
      }
    };

    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // DROPDOWN AUTO POSITION
  useEffect(() => {
    if (!activeDropdown) {
      setDropdownPlacement("down");
      setDropdownMaxHeight(null);
      return;
    }

    const updateDropdownPosition = () => {
      const trigger = dropdownTriggerRef.current;
      const menu = dropdownMenuRef.current;

      if (!trigger || !menu) return;

      if (window.matchMedia("(max-width: 850px)").matches) {
        setDropdownPlacement("down");
        setDropdownMaxHeight(null);
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const availableBelow = Math.max(
        0,
        window.innerHeight - triggerRect.bottom - 18
      );
      const availableAbove = Math.max(0, triggerRect.top - 18);

      const requiredHeight = menu.scrollHeight;
      const opensUp =
        requiredHeight > availableBelow &&
        availableAbove > availableBelow;

      const availableSpace = opensUp
        ? availableAbove
        : availableBelow;

      setDropdownPlacement(opensUp ? "up" : "down");
      setDropdownMaxHeight(
        Math.max(90, Math.floor(availableSpace - 12))
      );
    };

    const frame = requestAnimationFrame(updateDropdownPosition);

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("orientationchange", updateDropdownPosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("orientationchange", updateDropdownPosition);
    };
  }, [activeDropdown, menuOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdown = (label) => {
    setActiveDropdown((current) => current === label ? null : label);
  };

// MOBILE HEADER POSITION CONTROL
useEffect(() => {
  const header = headerRef.current;
  if (!header) return;

  const isMobile = window.matchMedia("(max-width: 850px)").matches;

  header.style.setProperty(
    "transition",
    "top 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
    "important"
  );

  if (isMobile && (menuOpen || activeDropdown)) {
    header.style.setProperty("top", "12px", "important");
    header.style.setProperty(
      "transform",
      "translate(-50%, 0)",
      "important"
    );
  } else {
    header.style.removeProperty("top");
    header.style.removeProperty("transform");
  }

  return () => {
    header.style.removeProperty("top");
    header.style.removeProperty("transform");
    header.style.removeProperty("transition");
  };
}, [menuOpen, activeDropdown]);

  return (
<header
  ref={headerRef}
  className={`site-header ${scrolled ? "scrolled" : ""} ${
    activeDropdown ? "mobile-dropdown-open" : ""
  }`}
>
      <div className="header-container">

        {/* BRAND */}
        <a
          className="brand"
          href="#home"
          aria-label="awlxdev homepage"
          onClick={closeMenus}
        >
          <span className="brand-icon">AD</span>
          <span className="brand-name">
            awlxdev
            <small>Solusi Digital</small>
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav
          className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isOpen = activeDropdown === item.label;
            const isActive = activeLink === item.href ||
              item.dropdown?.some((subItem) => activeLink === subItem.href);

            return (
              <div
                className={`nav-item ${hasDropdown ? "has-dropdown" : ""}`}
                key={item.label}
              >
                {hasDropdown ? (
                  <>
                    <button
                      className={`nav-link dropdown-trigger ${isActive || isOpen ? "active" : ""}`}
                      ref={isOpen ? dropdownTriggerRef : null}
                      onClick={() => handleDropdown(item.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronIcon open={isOpen} />
                    </button>

                    <div
                      ref={isOpen ? dropdownMenuRef : null}
                      className={`dropdown-menu ${isOpen ? "show" : ""} ${
                        isOpen && dropdownPlacement === "up" ? "opens-up" : ""
                      }`}
                      style={{
                        maxHeight: isOpen && dropdownMaxHeight
                          ? `${dropdownMaxHeight}px`
                          : undefined,
                      }}
                    >
                      <div className="dropdown-heading">
                        <span>JELAJAHI AWLXDEV</span>
                        <p>Jelajahi what we can create together.</p>
                      </div>

                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          className="dropdown-link"
                          onClick={() => {
                            setActiveLink(subItem.href);
                            closeMenus();
                          }}
                        >
                          <span className="dropdown-link-content">
                            <strong>{subItem.label}</strong>
                            <small>{subItem.description}</small>
                          </span>
                          <span className="dropdown-arrow">↗</span>
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <a
                    href={item.href}
                    className={`nav-link ${activeLink === item.href ? "active" : ""}`}
                    onClick={() => {
                      setActiveLink(item.href);
                      closeMenus();
                    }}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        {/* HEADER ACTION */}
        <div className="header-actions">
          <a
            href="#contact"
            className="header-cta"
            onClick={closeMenus}
          >
            <span>Hubungi Kami</span>
            <ArrowIcon />
          </a>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => {
            setMenuOpen((current) => !current);
            setActiveDropdown(null);
          }}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;






