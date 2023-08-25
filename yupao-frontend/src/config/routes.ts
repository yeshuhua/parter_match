import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";
import UserProfilePage from "../pages/UserProfilePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import Search from "../pages/Search.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamEditPage from "../pages/TeamEditPage.vue";
import User from "../pages/User.vue";
const routes = [
    { path: '/', title: '伙伴匹配', component: Index },
    { path: '/team', title: '找队伍', component: Team },
    { path: '/user', title: '用户页', component: User },
    { path: '/user/profile', title: '用户个人信息', component: UserProfilePage },
    { path: '/search', component: Search },
    {
        // 考虑用动态路由还是路径传参，由于需要传一个key=value的形式，选择路径传参
        path: '/user/edit',
        title: '用户编辑',
        component: UserEditPage
    },
    { path: '/user/list', title: '搜索结果', component: SearchResultPage },
    { path: '/user/login', title: '登录页', component: UserLoginPage },
    { path: '/team/add', title: '队伍添加', component: TeamAddPage },
    { path: '/team/edit', title: '队伍编辑', component: TeamEditPage },
    { path: '/user/team/join', title: '我加入的队伍', component: UserTeamJoinPage },
    { path: '/user/team/create', title: '我创建的队伍', component: UserTeamCreatePage }
]
export default routes;