import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); } }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: resolve => { require(['@/views/international/international.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/component',
        icon: 'ios-analytics',
        name: 'component',
        title: '数据分析',
        component: Main,
        children: [
            {
                path: 'test-data',
                icon: 'compose',
                name: 'test-data',
                title: '缺陷统计',
                component: resolve => { require(['@/views/my-components/test-data/test-data.vue'], resolve); }
            }
            // {
            //     path: 'import-data',
            //     icon: 'pound',
            //     name: 'import-data',
            //     title: '数据录入',
            //     component: resolve => { require(['@/views/my-components/data-edit/import-data.vue'], resolve); }
            // }
            // {
            //     path: 'test-data',
            //     icon: 'compose',
            //     name: 'test-data',
            //     title: '缺陷趋势',
            //     component: resolve => { require(['@/views/my-components/test-data/test-data.vue'], resolve); }
            // },
            // {
            //     path: 'text-editor',
            //     icon: 'compose',
            //     name: 'text-editor',
            //     title: '富文本编辑器',
            //     component: resolve => { require(['@/views/my-components/text-editor/test-data.vue'], resolve); }
            // },
            // {
            //     path: 'text-editor',
            //     icon: 'compose',
            //     name: 'text-editor',
            //     title: '富文本编辑器',
            //     component: resolve => { require(['@/views/my-components/text-editor/text-editor.vue'], resolve); }
            // },
            // {
            //     path: 'md-editor',
            //     icon: 'pound',
            //     name: 'md-editor',
            //     title: 'Markdown编辑器',
            //     component: resolve => { require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve); }
            // },
            // {
            //     path: 'image-editor',
            //     icon: 'crop',
            //     name: 'image-editor',
            //     title: '图片预览编辑',
            //     component: resolve => { require(['@/views/my-components/image-editor/image-editor.vue'], resolve); }
            // },
            // {
            //     path: 'draggable-list',
            //     icon: 'arrow-move',
            //     name: 'draggable-list',
            //     title: '可拖拽列表',
            //     component: resolve => { require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve); }
            // },
            // {
            //     path: 'area-linkage',
            //     icon: 'ios-more',
            //     name: 'area-linkage',
            //     title: '城市级联',
            //     component: resolve => { require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve); }
            // },
            // {
            //     path: 'file-upload',
            //     icon: 'android-upload',
            //     name: 'file-upload',
            //     title: '文件上传',
            //     component: resolve => { require(['@/views/my-components/file-upload/file-upload.vue'], resolve); }
            // },
            // {
            //     path: 'count-to',
            //     icon: 'arrow-graph-up-right',
            //     name: 'count-to',
            //     title: '数字渐变',
            //     component: resolve => { require(['@/views/my-components/count-to/count-to.vue'], resolve); }
            // }
            // {
            //     path: 'clipboard-page',
            //     icon: 'clipboard',
            //     name: 'clipboard-page',
            //     title: '一键复制',
            //     component: resolve => { require(['@/views/my-components/clipboard/clipboard.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/projects',
        icon: 'social-buffer',
        name: 'projects',
        title: '项目管理',
        component: Main,
        children: [
            {
                path: 'project',
                icon: 'compose',
                name: 'project',
                title: '项目',
                component: resolve => { require(['@/views/projects/project.vue'], resolve); }
            },
            {
                path: 'environment',
                icon: 'pound',
                name: 'environment',
                title: '环境',
                component: resolve => { require(['@/views/projects/environment.vue'], resolve); }
            },
            {
                path: 'db',
                icon: 'clipboard',
                name: 'db',
                title: '数据库管理',
                component: resolve => { require(['@/views/projects/db.vue'], resolve); }
            },
            {
                path: 'apiurl',
                icon: 'ios-infinite',
                name: 'apiurl',
                title: '接口管理',
                component: resolve => { require(['@/views/projects/apiurl.vue'], resolve); }
            }
        ]
    },
    {
        path: '/case',
        icon: 'crop',
        name: 'case',
        title: '用例管理',
        component: Main,
        children: [
            {
                path: 'basecase',
                icon: 'compose',
                name: 'basecase',
                title: '基础用例',
                component: resolve => { require(['@/views/case/basecase.vue'], resolve); }
            },
            {
                path: 'case-collector',
                icon: 'pound',
                name: 'case-collector',
                title: '测试集',
                component: resolve => { require(['@/views/case/case-collector.vue'], resolve); }
            }
        ]
    },
    {
        path: '/testschedule',
        icon: 'arrow-graph-up-right',
        name: 'testschedule',
        title: '测试计划',
        component: Main,
        children: [
            {
                path: 'test-schedule',
                icon: 'compose',
                name: 'test-schedule',
                title: '测试计划',
                component: resolve => { require(['@/views/testschedule/test-schedule.vue'], resolve); }
            }
        ]
    },
    {
        path: '/testtasks',
        icon: 'clipboard',
        name: 'testtasks',
        title: '调度管理',
        component: Main,
        children: [
            {
                path: 'task',
                icon: 'compose',
                name: 'task',
                title: '调度',
                component: resolve => { require(['@/views/testtasks/task.vue'], resolve); }
            },
            {
                path: 'jobs',
                icon: 'pound',
                name: 'jobs',
                title: '任务',
                component: resolve => { require(['@/views/testtasks/jobs.vue'], resolve); }
            }
            // {
            //     path: 'clipboard-page',
            //     icon: 'clipboard',
            //     name: 'clipboard-page',
            //     title: '一键复制',
            //     component: resolve => { require(['@/views/my-components/clipboard/clipboard.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/jenkins',
        icon: 'social-buffer',
        name: 'jenkins',
        title: 'Jenkins',
        component: Main,
        children: [
            {
                path: 'jenkins-server',
                icon: 'compose',
                name: 'jenkins-server',
                title: 'Jenkins服务',
                component: resolve => { require(['@/views/jenkins/jenkins-server.vue'], resolve); }
            },
            {
                path: 'jenkins-job',
                icon: 'pound',
                name: 'jenkins-job',
                title: 'JenkinsJobs',
                component: resolve => { require(['@/views/jenkins/jenkins-job.vue'], resolve); }
            }]
    },
    {
        path: '/sonar',
        icon: 'ios-infinite',
        name: 'sonar',
        title: '代码质量',
        component: Main,
        children: [
            {
                path: 'sonar-server',
                icon: 'compose',
                name: 'sonar-server',
                title: 'sonar服务',
                component: resolve => { require(['@/views/sonar/sonar-server.vue'], resolve); }
            },
            {
                path: 'sonar-scan',
                icon: 'pound',
                name: 'sonar-scan',
                title: 'Sonar扫描',
                component: resolve => { require(['@/views/sonar/sonar-scan.vue'], resolve); }
            }]
    }

    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['@/views/form/article-publish/article-publish.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['@/views/form/work-flow/work-flow.vue'], resolve); } }
    //
    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['@/views/tables/dragable-table.vue'], resolve); } },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['@/views/tables/searchable-table.vue'], resolve); } },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['@/views/tables/exportable-table.vue'], resolve); } },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['@/views/tables/table-to-image.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['@/views/advanced-router/mutative-router.vue'], resolve); } },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
