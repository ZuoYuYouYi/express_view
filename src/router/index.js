import Vue from 'vue'
import Router from 'vue-router'

const Express = () => import('@/components/express/express').then(
  express => express.default)
const Me = () => import('@/components/me/me').then(
  me => me.default)
const ExpressList = () => import ('@/components/express/expressList').then(
  expressList => expressList.default)
const ExpressIssue = () => import ('@/components/express/expressIssue').then(
  expressIssue => expressIssue.default)
const AboutMe = () => import('@/components/me/aboutMe').then(
  aboutMe => aboutMe.default)
const Login = () => import('@/components/login').then(
  login => login.default)
const Information = () => import('@/components/me/information').then(
  information => information.default)
const Suggest = () => import('@/components/me/suggest').then(
  suggest => suggest.default)
const ExpressIndent = () => import('@/components/me/expressIndent').then(
  expressIndent => expressIndent.default)
const DeliverymanIndent = () => import('@/components/me/deliverymanIndent').then(
  deliverymanIndent => deliverymanIndent.default)
const Criteria = () => import ('@/components/me/criteria').then(
  criteria => criteria.default)
const Register = () => import ('@/components/register').then(
  register => register.default)

Vue.use(Router)

export default new Router({
  routes: [
    // 首页重定向
    {
      path: '/',
      redirect: {
        name: 'expressList'
      }
    },
    // 快递
    {
      name: 'express',
      path: '/express',
      component: Express,
      children: [
        // 快递列表
        {
          name: 'expressList',
          path: '/express/expressList',
          component: ExpressList,
          meta: {
            isSelected: true
          }
        },
        // 发布快递
        {
          name: 'expressIssue',
          path: '/express/expressIssue',
          component: ExpressIssue,
          meta: {
            isSelected: false
          }
        }
      ]
    },
    // 我的
    {
      name: 'me',
      path: '/me',
      component: Me,
    },
    // 审核
    {
      name: 'criteria',
      path: '/me/criteria',
      component: Criteria,
      meta: {
        allowBack: true
      }
    },
    // 修改手机号
    {
      name: 'information',
      path: '/me/information',
      component: Information,
      meta: {
        allowBack: true
      }
    },
    // 快递订单
    {
      name: 'expressIndent',
      path: '/me/expressIndent',
      component: ExpressIndent,
      meta: {
        allowBack: true
      }
    },
    {
      name: 'deliverymanIndent',
      path: 'me/deliverymanIndent',
      component: DeliverymanIndent,
      meta: {
        allowBack: true
      }
    },
    // 关于我们
    {
      name: 'aboutMe',
      path: '/me/about',
      component: AboutMe,
      meta: {
        allowBack: true
      }
    },
    // 建议
    {
      name: 'suggest',
      path: '/me/suggest',
      component: Suggest,
      meta: {
        allowBack: true
      }
    },
    // 登录
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {
        allowBack: true
      }
    },
    // 注册
    {
      name: 'register',
      path: '/register',
      component: Register,
      meta: {
        allowBack: true
      }
    }
  ]
})
