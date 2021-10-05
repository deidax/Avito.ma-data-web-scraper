const routes = [
    {
        path: '/',
        component: () => import('../views/Login.vue'),
        name: 'login',
        meta:{
            guestOnly:true
        }
    },
    {
        path:'/dashboard',
        component: () => import('../views/Dashboard.vue'),
        name:'dashboard',
        meta:{
          authOnly:true
        }
    },
    {
        path:'/products_data',
        component: () => import('../views/Crawler.vue'),
        name:'products_data',
        meta:{
          authOnly:true
        }
    },
    {
        path:'/crawlers_list',
        component: () => import('../views/Crawler.vue'),
        name:'crawlers_list',
        meta:{
          authOnly:true
        }
    },
]




export default routes;