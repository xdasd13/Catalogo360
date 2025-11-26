document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  // Active Menu Item Logic
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    const href = item.getAttribute("href");

    if (!href) return;

    // Check if the current path starts with the href (for sub-routes like /admin/productos/nuevo)
    // But handle the dashboard root /admin specifically to avoid matching everything
    let isActive = false;

    if (href === "/admin") {
      isActive = currentPath === "/admin" || currentPath === "/admin/";
    } else {
      // Ensure strict matching for sub-paths to avoid partial matches if you had /admin/prod and /admin/products
      // But here we rely on startsWith which is generally fine for this structure
      isActive = currentPath.startsWith(href);
    }

    if (isActive) {
      // Remove default inactive classes
      item.classList.remove(
        "text-gray-400",
        "hover:bg-white/5",
        "hover:text-white"
      );

      // Add active classes
      item.classList.add("text-white", "bg-app-green", "shadow-md");

      // Change icon color if needed (though text-white handles most)
      const icon = item.querySelector("i");
      if (icon) {
        icon.classList.remove("group-hover:text-app-green");
      }
    }
  });
});
