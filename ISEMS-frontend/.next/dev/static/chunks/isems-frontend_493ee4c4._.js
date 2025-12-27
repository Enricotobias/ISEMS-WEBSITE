(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/isems-frontend/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatBytes",
    ()=>formatBytes,
    "formatDateOnly",
    ()=>formatDateOnly,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "formatTemperature",
    ()=>formatTemperature,
    "formatTimeOnly",
    ()=>formatTimeOnly,
    "formatTimestamp",
    ()=>formatTimestamp,
    "formatUptime",
    ()=>formatUptime,
    "getDayName",
    ()=>getDayName,
    "getErrorDescription",
    ()=>getErrorDescription,
    "getFanIcon",
    ()=>getFanIcon,
    "getHealthColor",
    ()=>getHealthColor,
    "getModeColor",
    ()=>getModeColor,
    "getModeIcon",
    ()=>getModeIcon,
    "getRSSIQuality",
    ()=>getRSSIQuality,
    "getScheduleTypeLabel",
    ()=>getScheduleTypeLabel,
    "getStatusColor",
    ()=>getStatusColor,
    "getTemperatureColor",
    ()=>getTemperatureColor,
    "isErrorCritical",
    ()=>isErrorCritical,
    "isValidTemperature",
    ()=>isValidTemperature,
    "isValidTime",
    ()=>isValidTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/date-fns/formatDistanceToNow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/date-fns/locale/id.js [app-client] (ecmascript)");
;
;
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatTimestamp(timestamp) {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "dd MMM yyyy, HH:mm:ss", {
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["id"]
    });
}
function formatRelativeTime(timestamp) {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(date, {
        addSuffix: true,
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["id"]
    });
}
function formatTimeOnly(timestamp) {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "HH:mm:ss");
}
function formatDateOnly(timestamp) {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "dd MMM yyyy", {
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["id"]
    });
}
function formatTemperature(temp) {
    return `${Math.round(temp)}°C`;
}
function getTemperatureColor(temp) {
    if (temp < 20) return "text-blue-500";
    if (temp < 25) return "text-green-500";
    if (temp < 28) return "text-yellow-500";
    return "text-red-500";
}
function getRSSIQuality(rssi) {
    if (rssi >= -50) return {
        label: "Excellent",
        color: "text-green-500",
        icon: "📶"
    };
    if (rssi >= -60) return {
        label: "Good",
        color: "text-green-400",
        icon: "📶"
    };
    if (rssi >= -70) return {
        label: "Fair",
        color: "text-yellow-500",
        icon: "📶"
    };
    if (rssi >= -80) return {
        label: "Weak",
        color: "text-orange-500",
        icon: "📶"
    };
    return {
        label: "Poor",
        color: "text-red-500",
        icon: "📵"
    };
}
function getStatusColor(status) {
    switch(status.toLowerCase()){
        case 'online':
            return "bg-green-500";
        case 'offline':
            return "bg-gray-400";
        case 'updating':
            return "bg-blue-500 animate-pulse";
        case 'rebooting':
            return "bg-orange-500 animate-pulse";
        default:
            return "bg-gray-400";
    }
}
function getHealthColor(health) {
    switch(health.toUpperCase()){
        case 'HEALTHY':
        case 'GOOD':
            return "text-green-500 bg-green-50";
        case 'WARNING':
        case 'FAIR':
            return "text-yellow-500 bg-yellow-50";
        case 'CRITICAL':
        case 'POOR':
            return "text-red-500 bg-red-50";
        default:
            return "text-gray-500 bg-gray-50";
    }
}
function getModeIcon(mode) {
    switch(mode.toUpperCase()){
        case 'COOL':
            return "❄️";
        case 'DRY':
            return "💧";
        case 'FAN':
            return "🌀";
        case 'HEAT':
            return "🔥";
        case 'AUTO':
            return "🤖";
        default:
            return "⚙️";
    }
}
function getModeColor(mode) {
    switch(mode.toUpperCase()){
        case 'COOL':
            return "text-blue-500 bg-blue-50";
        case 'DRY':
            return "text-cyan-500 bg-cyan-50";
        case 'FAN':
            return "text-gray-500 bg-gray-50";
        case 'HEAT':
            return "text-red-500 bg-red-50";
        case 'AUTO':
            return "text-purple-500 bg-purple-50";
        default:
            return "text-gray-500 bg-gray-50";
    }
}
function getFanIcon(speed) {
    switch(speed.toUpperCase()){
        case 'HIGH':
            return "🌀🌀🌀";
        case 'MID':
            return "🌀🌀";
        case 'LOW':
            return "🌀";
        case 'AUTO':
            return "🤖";
        default:
            return "⚙️";
    }
}
function getErrorDescription(code) {
    const errorMap = {
        'E0': 'No Error',
        'E1': 'Room Temperature Sensor Error',
        'E2': 'Evaporator Temperature Sensor Error',
        'E3': 'Condenser Temperature Sensor Error',
        'E4': 'Outdoor Unit Error',
        'E5': 'Communication Error',
        'E6': 'Communication Error (Inferred)',
        'E7': 'Mode Conflict',
        'E8': 'Compressor Protection',
        'E9': 'System Error'
    };
    return errorMap[code] || `Unknown Error (${code})`;
}
function isErrorCritical(code) {
    return [
        'E1',
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E9'
    ].includes(code);
}
function formatUptime(seconds) {
    if (!seconds || seconds < 0) return '0m';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    // 1. Jika lebih dari 1 hari -> Tampilkan Hari, Jam, Menit
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    // 2. Jika lebih dari 1 jam -> Tampilkan Jam & Menit
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    // 3. Jika kurang dari 1 jam -> Tampilkan Menit saja
    return `${minutes}m`;
}
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
function isValidTemperature(temp) {
    return temp >= 16 && temp <= 30;
}
function isValidTime(time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}
function getScheduleTypeLabel(type) {
    const labels = {
        'full_time': 'Full Time',
        'part_time': 'Part Time',
        'libur': 'Libur'
    };
    return labels[type] || type;
}
function getDayName(day) {
    const dayNames = {
        'senin': 'Senin',
        'selasa': 'Selasa',
        'rabu': 'Rabu',
        'kamis': 'Kamis',
        'jumat': 'Jumat',
        'sabtu': 'Sabtu',
        'minggu': 'Minggu'
    };
    return dayNames[day.toLowerCase()] || day;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/components/shared/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const menuItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        description: 'Monitoring real-time'
    },
    {
        title: 'Remote Control',
        href: '/remote',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"],
        description: 'Kontrol AC'
    },
    {
        title: 'Automation',
        href: '/automation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        description: 'Pengaturan otomasi'
    },
    {
        title: 'Event Logs',
        href: '/logs',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        description: 'Riwayat aktivitas'
    }
];
function Sidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-16 items-center gap-3 border-b px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                            className: "h-6 w-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold text-gray-900",
                                children: "ISEMS"
                            }, void 0, false, {
                                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: "Smart AC Control"
                            }, void 0, false, {
                                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "space-y-1 p-4",
                children: menuItems.map((item)=>{
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 rounded-lg px-4 py-3 transition-all", isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-50"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")
                            }, void 0, false, {
                                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                lineNumber: 75,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium", isActive ? "text-blue-600" : "text-gray-700"),
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 border-t bg-gray-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                className: "h-5 w-5 text-white"
                            }, void 0, false, {
                                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-gray-700",
                                    children: "System Active"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-500",
                                    children: "All systems operational"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/isems-frontend/components/shared/sidebar.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "controlAPI",
    ()=>controlAPI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "devicesAPI",
    ()=>devicesAPI,
    "eventsAPI",
    ()=>eventsAPI,
    "healthAPI",
    ()=>healthAPI,
    "telemetryAPI",
    ()=>telemetryAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});
// Response interceptor untuk error handling
apiClient.interceptors.response.use((response)=>response, (error)=>{
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
});
const devicesAPI = {
    getAll: ()=>apiClient.get('/devices'),
    getById: (id)=>apiClient.get(`/devices/${id}`)
};
const telemetryAPI = {
    getLogs: (deviceId, limit = 50)=>apiClient.get(`/logs/${deviceId}`, {
            params: {
                limit
            }
        }),
    getLatest: (deviceId)=>apiClient.get(`/logs/${deviceId}`, {
            params: {
                limit: 1
            }
        })
};
const healthAPI = {
    // Mengambil data kesehatan terakhir
    getLatest: (deviceId)=>apiClient.get(`/health/${deviceId}`)
};
const eventsAPI = {
    getLogs: (deviceId, limit = 100)=>apiClient.get(`/events/${deviceId}`, {
            params: {
                limit
            }
        })
};
const controlAPI = {
    // Send remote control command
    sendRemote: (deviceId, command)=>apiClient.post(`/control/${deviceId}`, command),
    // Update device settings
    updateSetting: (deviceId, settings)=>apiClient.post(`/setting/${deviceId}`, settings),
    // === TAMBAHAN BARU ===
    // Request Diagnostics
    requestDiagnostics: (deviceId)=>apiClient.post(`/diagnostics/${deviceId}`, {})
};
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/lib/mqtt.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "mqttService",
    ()=>mqttService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$mqtt$2f$dist$2f$mqtt$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/mqtt/dist/mqtt.esm.js [app-client] (ecmascript)");
;
class MQTTService {
    client = null;
    messageHandlers = new Set();
    isConnecting = false;
    connect() {
        if (this.client?.connected || this.isConnecting) {
            return this.client;
        }
        const host = ("TURBOPACK compile-time value", "mqtt.nicourbanindonesia.com");
        const port = ("TURBOPACK compile-time value", "8084");
        const protocol = ("TURBOPACK compile-time value", "wss") || 'wss';
        // PENTING: Tambahkan /mqtt di akhir karena ini standar WebSocket Broker
        const url = `${protocol}://${host}:${port}/mqtt`;
        console.log(`[MQTT] Connecting to: ${url}`);
        this.isConnecting = true;
        this.client = __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$mqtt$2f$dist$2f$mqtt$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].connect(url, {
            username: ("TURBOPACK compile-time value", "isems"),
            password: ("TURBOPACK compile-time value", "Atop88ls"),
            clientId: `web_client_${Math.random().toString(16).slice(2, 8)}`,
            reconnectPeriod: 5000,
            connectTimeout: 30000,
            keepalive: 60,
            clean: true
        });
        this.client.on('connect', ()=>{
            console.log('[MQTT] ✓ Connected via WebSocket Secure');
            this.isConnecting = false;
            // Subscribe ulang saat reconnect
            this.subscribe('isems/devices/#');
            this.subscribe('isems/command/#');
        });
        this.client.on('error', (err)=>{
            console.error('[MQTT] Connection Error:', err.message);
            this.isConnecting = false;
        });
        this.client.on('close', ()=>{
            console.log('[MQTT] Connection Closed');
            this.isConnecting = false;
        });
        this.client.on('message', (topic, message)=>{
            const msgString = message.toString();
            this.messageHandlers.forEach((handler)=>handler(topic, msgString));
        });
        return this.client;
    }
    subscribe(topic) {
        if (!this.client) return;
        this.client.subscribe(topic, (err)=>{
            if (err) console.error(`[MQTT] Subscribe failed: ${topic}`);
            else console.log(`[MQTT] Subscribed: ${topic}`);
        });
    }
    publish(topic, message) {
        if (!this.client?.connected) {
            console.warn('[MQTT] Cannot publish - Offline');
            return;
        }
        const payload = typeof message === 'string' ? message : JSON.stringify(message);
        this.client.publish(topic, payload, {
            qos: 1
        });
    }
    addMessageHandler(handler) {
        this.messageHandlers.add(handler);
        return ()=>{
            this.messageHandlers.delete(handler);
        };
    }
    isConnected() {
        return !!this.client?.connected;
    }
    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.isConnecting = false;
        }
    }
}
const mqttService = new MQTTService();
const __TURBOPACK__default__export__ = mqttService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/hooks/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDeviceHealth",
    ()=>useDeviceHealth,
    "useDeviceStatus",
    ()=>useDeviceStatus,
    "useDevices",
    ()=>useDevices,
    "useEventLogs",
    ()=>useEventLogs,
    "useMQTTConnection",
    ()=>useMQTTConnection,
    "useModeControl",
    ()=>useModeControl,
    "useRemoteControl",
    ()=>useRemoteControl,
    "useTelemetry",
    ()=>useTelemetry,
    "useTemperatureControl",
    ()=>useTemperatureControl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/lib/mqtt.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
;
;
;
;
function useDevices() {
    _s();
    const { data, error, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])('/devices', {
        "useDevices.useSWR": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devicesAPI"].getAll().then({
                "useDevices.useSWR": (res)=>res.data
            }["useDevices.useSWR"])
    }["useDevices.useSWR"]);
    return {
        devices: data || [],
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
}
_s(useDevices, "pbBX9XurWnZRjcYBDDzfT5aPhoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
function useTelemetry(deviceId, limit = 50) {
    _s1();
    // PERBAIKAN DI SINI:
    // Tambahkan query param ?limit=${limit} ke dalam Key SWR
    // Agar request "Card" (limit 1) dan "Chart" (limit 50) tidak tabrakan cache-nya.
    const { data, error, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(deviceId ? `/logs/${deviceId}?limit=${limit}` : null, {
        "useTelemetry.useSWR": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["telemetryAPI"].getLogs(deviceId, limit).then({
                "useTelemetry.useSWR": (res)=>res.data
            }["useTelemetry.useSWR"])
    }["useTelemetry.useSWR"], {
        refreshInterval: 5000
    });
    const [realtimeData, setRealtimeData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTelemetry.useEffect": ()=>{
            if (!deviceId) return;
            if (data) {
                setRealtimeData(data);
            }
            const cleanup = __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].addMessageHandler({
                "useTelemetry.useEffect.cleanup": (topic, message)=>{
                    const dataTopic = `isems/devices/${deviceId}/data`;
                    if (topic === dataTopic) {
                        try {
                            const mqttData = JSON.parse(message);
                            const newLog = {
                                id: Date.now(),
                                device_id: deviceId,
                                power: mqttData.power,
                                current_temp: mqttData.current_temp,
                                mode: mqttData.mode,
                                fan_speed: mqttData.fan_speed,
                                error_code: mqttData.error_code,
                                wifi_rssi: mqttData.wifi_rssi,
                                rtc_status: mqttData.rtc_status,
                                read_unit: mqttData.read_unit,
                                timestamp: new Date().toISOString()
                            };
                            setRealtimeData({
                                "useTelemetry.useEffect.cleanup": (prev)=>[
                                        newLog,
                                        ...prev.slice(0, limit - 1)
                                    ]
                            }["useTelemetry.useEffect.cleanup"]);
                        } catch (err) {
                            console.error('[useTelemetry] Parse error:', err);
                        }
                    }
                }
            }["useTelemetry.useEffect.cleanup"]);
            return cleanup;
        }
    }["useTelemetry.useEffect"], [
        deviceId,
        limit,
        data
    ]);
    return {
        logs: realtimeData,
        latest: realtimeData[0] || null,
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
}
_s1(useTelemetry, "9ROAd4+qtZm/JLe9ao+8DbT3D80=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
function useDeviceHealth(deviceId) {
    _s2();
    const { data, error, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(deviceId ? `/health/${deviceId}` : null, {
        "useDeviceHealth.useSWR": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["healthAPI"].getLatest(deviceId).then({
                "useDeviceHealth.useSWR": (res)=>{
                    // Handle jika return array atau object tunggal
                    return Array.isArray(res.data) ? res.data[0] : res.data;
                }
            }["useDeviceHealth.useSWR"])
    }["useDeviceHealth.useSWR"], {
        refreshInterval: 10000
    } // Cek kesehatan setiap 10 detik
    );
    return {
        health: data,
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
}
_s2(useDeviceHealth, "pbBX9XurWnZRjcYBDDzfT5aPhoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
function useDeviceStatus(deviceId) {
    _s3();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('offline');
    const [lastDisconnect, setLastDisconnect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [offlineDuration, setOfflineDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // 1. Fetch Status Awal dari Database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDeviceStatus.useEffect": ()=>{
            if (!deviceId) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devicesAPI"].getAll().then({
                "useDeviceStatus.useEffect": (res)=>{
                    const device = res.data.find({
                        "useDeviceStatus.useEffect.device": (d)=>d.device_id === deviceId
                    }["useDeviceStatus.useEffect.device"]);
                    if (device && device.status) {
                        setStatus(device.status);
                    }
                }
            }["useDeviceStatus.useEffect"]);
        }
    }["useDeviceStatus.useEffect"], [
        deviceId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDeviceStatus.useEffect": ()=>{
            if (!deviceId) return;
            const cleanup = __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].addMessageHandler({
                "useDeviceStatus.useEffect.cleanup": (topic, message)=>{
                    const statusTopic = `isems/devices/${deviceId}/status`;
                    if (topic === statusTopic) {
                        try {
                            if (message.startsWith('{')) {
                                const statusData = JSON.parse(message);
                                setStatus(statusData.status);
                                if (statusData.last_disconnect) setLastDisconnect(statusData.last_disconnect);
                                if (statusData.offline_duration_s) setOfflineDuration(statusData.offline_duration_s);
                            } else {
                                setStatus(message);
                            }
                        } catch (err) {
                            setStatus(message);
                        }
                    }
                }
            }["useDeviceStatus.useEffect.cleanup"]);
            return cleanup;
        }
    }["useDeviceStatus.useEffect"], [
        deviceId
    ]);
    return {
        status,
        isOnline: status === 'online',
        lastDisconnect,
        offlineDuration
    };
}
_s3(useDeviceStatus, "M92korn9zHfavu7g1Wewq/j4wFo=");
function useRemoteControl(deviceId) {
    _s4();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastCommand, setLastCommand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ackStatus, setAckStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRemoteControl.useEffect": ()=>{
            if (!deviceId) return;
            const cleanup = __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].addMessageHandler({
                "useRemoteControl.useEffect.cleanup": (topic, message)=>{
                    const ackTopic = `isems/devices/${deviceId}/ack`;
                    if (topic === ackTopic) {
                        try {
                            const ack = JSON.parse(message);
                            if (ack.cmd === 'remote') {
                                setAckStatus(ack.status);
                                setIsLoading(false);
                                setTimeout({
                                    "useRemoteControl.useEffect.cleanup": ()=>setAckStatus(null)
                                }["useRemoteControl.useEffect.cleanup"], 3000);
                            }
                        } catch (err) {
                            console.error('[useRemoteControl] ACK parse error:', err);
                        }
                    }
                }
            }["useRemoteControl.useEffect.cleanup"]);
            return cleanup;
        }
    }["useRemoteControl.useEffect"], [
        deviceId
    ]);
    const sendCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRemoteControl.useCallback[sendCommand]": async (command)=>{
            setIsLoading(true);
            setLastCommand(command);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["controlAPI"].sendRemote(deviceId, command);
                setTimeout({
                    "useRemoteControl.useCallback[sendCommand]": ()=>{
                        setIsLoading({
                            "useRemoteControl.useCallback[sendCommand]": (currentLoading)=>{
                                if (currentLoading) {
                                    setAckStatus('failed');
                                    return false;
                                }
                                return currentLoading;
                            }
                        }["useRemoteControl.useCallback[sendCommand]"]);
                    }
                }["useRemoteControl.useCallback[sendCommand]"], 5000);
            } catch (error) {
                console.error('[RemoteControl] Send error:', error);
                setIsLoading(false);
                setAckStatus('failed');
            }
        }
    }["useRemoteControl.useCallback[sendCommand]"], [
        deviceId
    ]);
    return {
        sendCommand,
        isLoading,
        lastCommand,
        ackStatus
    };
}
_s4(useRemoteControl, "3rERFGG4viacwAOlfjJUR3OQy/A=");
function useMQTTConnection() {
    _s5();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const connectionAttempted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMQTTConnection.useEffect": ()=>{
            if (!connectionAttempted.current) {
                connectionAttempted.current = true;
                __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].connect();
            }
            const interval = setInterval({
                "useMQTTConnection.useEffect.interval": ()=>{
                    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].isConnected === 'function') {
                        setIsConnected(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$mqtt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mqttService"].isConnected());
                    }
                }
            }["useMQTTConnection.useEffect.interval"], 2000);
            return ({
                "useMQTTConnection.useEffect": ()=>clearInterval(interval)
            })["useMQTTConnection.useEffect"];
        }
    }["useMQTTConnection.useEffect"], []);
    return {
        isConnected
    };
}
_s5(useMQTTConnection, "D3H+wzFM10YLUIx9WFrfDDdAFvk=");
function useTemperatureControl(deviceId, initialTemp = 24) {
    _s6();
    const [temperature, setTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialTemp);
    const { sendCommand, isLoading } = useRemoteControl(deviceId);
    const increaseTemp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTemperatureControl.useCallback[increaseTemp]": ()=>{
            const newTemp = Math.min(temperature + 1, 30);
            setTemperature(newTemp);
            sendCommand({
                temp: newTemp
            });
        }
    }["useTemperatureControl.useCallback[increaseTemp]"], [
        temperature,
        sendCommand
    ]);
    const decreaseTemp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTemperatureControl.useCallback[decreaseTemp]": ()=>{
            const newTemp = Math.max(temperature - 1, 16);
            setTemperature(newTemp);
            sendCommand({
                temp: newTemp
            });
        }
    }["useTemperatureControl.useCallback[decreaseTemp]"], [
        temperature,
        sendCommand
    ]);
    const setTemp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTemperatureControl.useCallback[setTemp]": (temp)=>{
            const validTemp = Math.max(16, Math.min(30, temp));
            setTemperature(validTemp);
            sendCommand({
                temp: validTemp
            });
        }
    }["useTemperatureControl.useCallback[setTemp]"], [
        sendCommand
    ]);
    return {
        temperature,
        increaseTemp,
        decreaseTemp,
        setTemp,
        isLoading
    };
}
_s6(useTemperatureControl, "ch6ATnwA4lJkEmdskY4nbuRTYx8=", false, function() {
    return [
        useRemoteControl
    ];
});
function useEventLogs(deviceId) {
    _s7();
    const { data, error, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(deviceId ? `/events/${deviceId}` : null, {
        "useEventLogs.useSWR": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventsAPI"].getLogs(deviceId).then({
                "useEventLogs.useSWR": (res)=>res.data
            }["useEventLogs.useSWR"])
    }["useEventLogs.useSWR"], {
        refreshInterval: 5000
    } // Auto refresh setiap 5 detik
    );
    return {
        initialLogs: data || [],
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
}
_s7(useEventLogs, "pbBX9XurWnZRjcYBDDzfT5aPhoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
function useModeControl(deviceId, initialMode = 'COOL') {
    _s8();
    const modes = [
        'COOL',
        'DRY',
        'FAN',
        'HEAT',
        'AUTO'
    ];
    const [currentMode, setCurrentMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMode);
    const { sendCommand, isLoading } = useRemoteControl(deviceId);
    const cycleMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModeControl.useCallback[cycleMode]": ()=>{
            const currentIndex = modes.indexOf(currentMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            const nextMode = modes[nextIndex];
            setCurrentMode(nextMode);
            sendCommand({
                mode: nextMode
            });
        }
    }["useModeControl.useCallback[cycleMode]"], [
        currentMode,
        sendCommand,
        modes
    ]);
    const setMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModeControl.useCallback[setMode]": (mode)=>{
            setCurrentMode(mode);
            sendCommand({
                mode
            });
        }
    }["useModeControl.useCallback[setMode]"], [
        sendCommand
    ]);
    return {
        currentMode,
        cycleMode,
        setMode,
        isLoading
    };
}
_s8(useModeControl, "w+HFvcf/t2xfDr8w7NHuHFMqsq4=", false, function() {
    return [
        useRemoteControl
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
            outline: "border-2 border-gray-300 bg-white hover:bg-gray-50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-gray-100",
            link: "text-primary underline-offset-4 hover:underline",
            success: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
            warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-12 rounded-lg px-8 text-base",
            xl: "h-14 rounded-xl px-10 text-lg",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, isLoading, children, disabled, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        disabled: disabled || isLoading,
        ...props,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                }, void 0, false, {
                    fileName: "[project]/isems-frontend/components/ui/button.tsx",
                    lineNumber: 52,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/isems-frontend/components/ui/button.tsx",
                    lineNumber: 53,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/isems-frontend/components/ui/button.tsx",
            lineNumber: 51,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)) : children
    }, void 0, false, {
        fileName: "[project]/isems-frontend/components/ui/button.tsx",
        lineNumber: 44,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/isems-frontend/components/shared/header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/hooks/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/isems-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Header() {
    _s();
    const { isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMQTTConnection"])();
    // SOLUSI: Inisialisasi dengan null agar Server & Client sepakat "kosong" dulu
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            // Set waktu langsung saat component sudah mount di browser
            setCurrentTime(new Date());
            const timer = setInterval({
                "Header.useEffect.timer": ()=>{
                    setCurrentTime(new Date());
                }
            }["Header.useEffect.timer"], 1000);
            return ({
                "Header.useEffect": ()=>clearInterval(timer)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed left-64 right-0 top-0 z-30 border-b bg-white/80 backdrop-blur-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-16 items-center justify-between px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-gray-900",
                                children: "Good Morning! 👋"
                            }, void 0, false, {
                                fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 min-h-[20px]",
                                children: [
                                    currentTime ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTimeOnly"])(currentTime) : '...',
                                    " WIB"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative hidden md:block",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search devices...",
                                    className: "h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/isems-frontend/components/shared/header.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${isConnected ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`,
                            children: isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: "MQTT Connected"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 63,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-2 w-2 rounded-full bg-green-500 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 64,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 68,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: "Disconnected"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 69,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-2 w-2 rounded-full bg-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                        lineNumber: 70,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/isems-frontend/components/shared/header.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white",
                                    children: "3"
                                }, void 0, false, {
                                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/isems-frontend/components/shared/header.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold shadow-md",
                            children: "A"
                        }, void 0, false, {
                            fileName: "[project]/isems-frontend/components/shared/header.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/isems-frontend/components/shared/header.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/isems-frontend/components/shared/header.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/isems-frontend/components/shared/header.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(Header, "9nGO32MwVrRgq38EwrXkG8qUnks=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$isems$2d$frontend$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMQTTConnection"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=isems-frontend_493ee4c4._.js.map