<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con" >
            <Card :bordered="false" style="background:#fff7">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input v-model="form.password" type="password" >
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <!--<FormItem prop="password">-->
                            <!--<Input type="password" v-model="form.password" placeholder="Password">-->
                            <!--<Icon type="ios-locked-outline" slot="prepend"></Icon>-->
                            <!--</Input>-->
                        <!--</FormItem>-->
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import $ from 'jquery';

export default {
    data () {
        return {
            form: {
                userName: 'admin',
                password: 'admin'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // Cookies.set('user', this.form.userName);
                    // Cookies.set('password', this.form.password);
                    let url = '/api/login'
                    let usr = {
                        username: this.form.userName,
                        password: this.form.password
                    };
                    $.ajax({
                        type: 'POST',
                        async: true,
                        url: url,
                        contentType: 'application/json',
                        data: JSON.stringify(usr),
                        dataType: 'json',
                        success: (result) => {
                            if (result.msg === '登录成功') {
                                this.$Message.success(result.msg);
                                Cookies.set('user', this.form.userName);
                                // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                                if (this.form.userName === 'admin') {
                                    Cookies.set('access', 0);
                                } else {
                                    Cookies.set('access', 1);
                                }
                                this.$nextTick(() => {
                                    this.$router.push({
                                        name: 'home_index'
                                    });
                                });
                            } else {
                                this.$Message.error(result.msg);
                                window.ajaxFail.call(this, result);
                            }
                        },
                        error: (errorMsg) => {
                            window.ajaxFail.call(this, errorMsg);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
