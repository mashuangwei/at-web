function ajaxFail (result) {
    if (result.msg !== undefined && result.msg === '未登录') {
        this.$store.commit('logout', this);
        this.$store.commit('clearOpenedSubmenu');
        this.$router.push('/login');
    }
    if (result.msg === undefined && result.status >= 400) {
        this.$Message.error('错误码：' + result.status + '，错误信息：' + result.statusText);
        this.$store.commit('logout', this);
        this.$store.commit('clearOpenedSubmenu');
        this.$router.push('/login');
    }
}

window.ajaxFail = ajaxFail;
