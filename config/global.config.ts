// react-query
export const REACT_QUERY_RETRY = 1
export const REACT_QUERY_STALE_TIME = 0 //60 * 1000 // 1 mins ;
export const REACT_QUERY_CACHE_TIME = 15 * (60 * 1000) // 15 mins ;
export const KEEP_PREVIOUS_DATA = false
export const REFECH_ON_WINDOW_FOCUS = false

// roles
export const ROLE_ADMIN = "ADMIN"
export const ROLE_DEFAULT = "DEFAULT"
export const ROLE_SUPER_ADMIN = "SUPER_ADMIN"


// navigation 
export const NAVIGATION_ROUTES = [
    { name: "Activités", href: "/activities", roles: [ROLE_DEFAULT] },
    { name: "Departements", href: "/departments", roles: [ROLE_SUPER_ADMIN] },
    { name: "Dashboard", href: "/dashboard", roles: [ROLE_ADMIN] },
    {
        href: "/profile",
        name: "Mon Profil",
        roles: [ROLE_SUPER_ADMIN, ROLE_DEFAULT, ROLE_ADMIN],
    },
]

export const ROUTES_GUARDS = {
    [ROLE_DEFAULT]: {
        routes: ["/profile", "/activities"],
        default: "activities"
    },
    [ROLE_ADMIN]: {
        routes: ["/profile", "/dashboard", "/dashboard/activity", "/dashboard/department"],
        default: "dashboard"
    },
    [ROLE_SUPER_ADMIN]: {
        routes: ["/profile", "/departments"],
        default: "departments"
    }
}
