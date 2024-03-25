import { createApp } from 'vue';
import * as VueRouter from "vue-router";
import './style.css';
import 'vant/lib/index.css';
import 'vant/es/notify/style';
import 'vant/es/toast/style';
import App from './App.vue';
import routes from './config/routes';
// 按需引入vant组件
import {
    Button,
    NavBar,
    Icon,
    Tabbar,
    TabbarItem,
    Toast,
    Search,
    Divider,
    TreeSelect,
    Tag,
    Row,
    Col,
    Cell,
    Field,
    Form,
    Card,
    Stepper,
    DatePicker,
    Popup,
    Notify,
    Tab,
    Tabs,
    Dialog,
    Skeleton
} from 'vant';

const app = createApp(App);

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes // `routes: routes` 的缩写
})
app.use(router);
// 全局挂载组件
app.use(Button);
app.use(NavBar);
app.use(Icon);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Toast);
app.use(Search);
app.use(Divider);
app.use(TreeSelect);
app.use(Tag);
app.use(Row);
app.use(Col);
app.use(Cell);
app.use(Form);
app.use(Field);
app.use(Card);
app.use(Stepper);
app.use(DatePicker);
app.use(Popup);
app.use(Notify);
app.use(Tab);
app.use(Tabs);
app.use(Dialog);
app.use(Skeleton)
app.mount('#app');
