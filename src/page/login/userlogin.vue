<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        size="small"
        auto-complete="off"
        placeholder="请输入用户名"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-yonghuming" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        :type="passwordType"
        v-model="loginForm.password"
        size="small"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin"
      >
        <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword" />
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <Verify
        @success="verifySuccess"
        :mode="'pop'"
        :captchaType="'blockPuzzle'"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";
import { getCode } from "@/api/code";
import Verify from "@/components/verifition/Verify";

export default {
  name: "Userlogin",
  components: {
    Verify,
  },
  data() {
    return {
      socialForm: {
        code: "",
        state: "",
      },
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        randomStr: "blockPuzzle",
      },
      checked: false,
      code: {
        src: undefined,
        len: 4,
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
      passwordType: "password",
    };
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  methods: {
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$refs.verify.show();
        }
      });
    },
    verifySuccess(params) {
      this.loginForm.code = params.captchaVerification;

      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        this.$router.push({ path: this.tagWel.value });
      });
    },
  },
};
</script>

<style>
</style>
