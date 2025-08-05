(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/services/AuthService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "getToken": ()=>getToken,
    "refreshToken": ()=>refreshToken
});
const getToken = ()=>{
    var _localStorage_getItem;
    return (_localStorage_getItem = localStorage.getItem("TOKEN")) !== null && _localStorage_getItem !== void 0 ? _localStorage_getItem : "";
};
const refreshToken = ()=>{
    var _localStorage_getItem;
    return (_localStorage_getItem = localStorage.getItem("REFRESH_TOKEN")) !== null && _localStorage_getItem !== void 0 ? _localStorage_getItem : "";
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/secret.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "BASE_URL_SECRET": ()=>BASE_URL_SECRET,
    "secret_key": ()=>secret_key
});
const BASE_URL_SECRET = "http://localhost:9595/api/v1";
const secret_key = "vikkyalogoaesgurukulpanel";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/AxiosUtils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/axios/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$AuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/AuthService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$secret$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/secret.ts [app-client] (ecmascript)");
;
;
;
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$secret$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL_SECRET"];
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});
// ----- Request interceptor -----
apiClient.interceptors.request.use((config)=>{
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$AuthService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])();
    if (token) {
        if (config.headers instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosHeaders"]) {
            config.headers.set("Authorization", "Bearer ".concat(token));
        } else if (typeof config.headers === "object" && config.headers !== null) {
            config.headers["Authorization"] = "Bearer ".concat(token);
        }
    }
    return config;
}, (error)=>Promise.reject(error));
// ----- Response interceptor -----
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    var _this;
    const { response, config } = error;
    if ((response === null || response === void 0 ? void 0 : response.status) === 401 && ((_this = response.data) === null || _this === void 0 ? void 0 : _this.message) === "Token Expired" && config && !config._retry) {
        try {
            config._retry = true;
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (refreshToken) {
                const refreshTokenPayload = {
                    refreshToken
                };
                const res = await apiClient.post("/auth/token", refreshTokenPayload);
                const { accessToken, refreshToken: newRefreshToken } = res.data;
                // Store new tokens
                localStorage.setItem("TOKEN", accessToken);
                localStorage.setItem("REFRESH_TOKEN", newRefreshToken);
                // Update Authorization header safely
                if (config.headers instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosHeaders"]) {
                    config.headers.set("Authorization", "Bearer ".concat(accessToken));
                } else if (typeof config.headers === "object" && config.headers !== null) {
                    config.headers["Authorization"] = "Bearer ".concat(accessToken);
                }
                return apiClient(config);
            }
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/secured/admin/roles/user-permission/[userId]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>UserPermissionPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$AxiosUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/AxiosUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function UserPermissionPage() {
    _s();
    const { userId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])(); // <- get userId from the URL
    const [selectedUser, setSelectedUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [permissionsState, setPermissionsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availableRoles, setAvailableRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const getSelectedUser = async (id)=>{
        try {
            if (!id.trim()) return;
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$AxiosUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/user/id/".concat(id));
            const user = res.data.result || {};
            setSelectedUser(user);
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid user id");
        }
    };
    const getAllPermissions = async ()=>{
        try {
            setLoading(true);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$AxiosUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/permissions/view");
            const allPermissions = res.data.result || [];
            setPermissionsState(allPermissions.map((perm)=>({
                    ...perm,
                    isCheckedNow: false,
                    fromRole: false
                })));
        } catch (err) {
            console.error("Failed to fetch permissions", err);
        } finally{
            setLoading(false);
        }
    };
    const fetchAllRoles = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$AxiosUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/permissions/view-all-roles");
            setAvailableRoles(res.data.result || []);
        } catch (err) {
            console.error("Failed to fetch roles", err);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserPermissionPage.useEffect": ()=>{
            if (userId) {
                getSelectedUser(userId);
            }
        }
    }["UserPermissionPage.useEffect"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserPermissionPage.useEffect": ()=>{
            getAllPermissions();
            fetchAllRoles();
        }
    }["UserPermissionPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            "User ID: ",
            userId
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/secured/admin/roles/user-permission/[userId]/page.tsx",
        lineNumber: 68,
        columnNumber: 10
    }, this);
}
_s(UserPermissionPage, "ywKlrfsYgd0VX5U6L5uBpcOaKwM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = UserPermissionPage;
var _c;
__turbopack_context__.k.register(_c, "UserPermissionPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_208540a8._.js.map