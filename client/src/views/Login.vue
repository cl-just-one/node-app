<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">米修后台管理系统</span>
        <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="60px" class="loginForm">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginUser.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginUser.password" autocomplete="off" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
          </el-form-item>
          <div class="tiparea">
            <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
  import jwt_decode from 'jwt-decode'
  export default {
    name: "login",
    components: {},
    data() {
      return {
        loginUser: {
          email:'',
          password: ''
        },
        rules: {
          email: [
            {
              type: 'email',
              message: '邮箱不能为空',
              required: true,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: "密码不能为空",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: '长度3到20',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/users/login', this.loginUser).then(res => {
              if (res) {
                // 登录成功
                // console.log(res);
                // token
                const { token } = res.data
                // 存储到ls
                localStorage.setItem("eleToken", token)
                // 解析token
                const decoded = jwt_decode(token)
                // console.log(decoded)
                // token存储到vuex中
                this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
                this.$store.dispatch('setUser', decoded)

                this.$router.push('/index')
              } else {
                // 登录失败
                this.$message({
                  type: "error",
                  message: res
                })
              }
            }).catch(err => {
              this.$message({
                  type: "error",
                  message: err
                })
            })
          } else {
            return false;
          }
        });
      },
      isEmpty(value) {
        return (
          value === undefined ||
          value === null ||
          (typeof value === "object" && Object.keys(value).length === 0) ||
          (typeof value === "string" && value.trim().length === 0)
        );
      }
    }
  }
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>