# async-validation

async-validator 验证规则, 凡使用async-validator的UI库都可用

##### install

```bash
yarn add @lincy/async-validation
# or
pnpm add @lincy/async-validation -D
```

```html
<el-form :model="data.form" :rules="data.rules" ref="ref">
    <el-form-item label="地址：" label-width="120px" prop="string1">
        <el-input v-model="data.form.string1" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码：" label-width="120px" prop="string2">
        <el-input v-model="data.form.string2" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码：" label-width="120px" prop="string3">
        <el-input v-model="data.form.string3" auto-complete="off"></el-input>
    </el-form-item>
</el-form>
```

```javascript
import rules from '@lincy/async-validation'

export default {
    data() {
        // 自定义规则
        const validator = (rule, value, callback) => {
            if (Number(this.int2) < Number(this.int1)) {
                return callback(new Error('int2不能小于int1'))
            }
            callback()
        }
        return {
            form: {
                string1: '',
                string2: '',
                string3: '',
                int1: '',
                int2: ''
            },
            data: {
                rules: {
                    // 输入框规则 rules.string('提示文字', 最大长度, 最小长度)
                    string1: rules.string('地址'),
                    string2: rules.string('密码', undefined, 6), // 最短6位
                    string3: rules.string('密码', 16, 6), // 6-16位

                    // 字母和数字
                    pass1: rules.letter_number('密码1'),
                    pass2: rules.letter_number('密码2', undefined, 6), // 最短6位
                    pass3: rules.letter_number('密码3', 16, 6), // 6-16位

                    // 下拉框, 单选框, 复选框规则
                    select1: rules.select('城市'),
                    select2: rules.select('城市', true), // 多选, 验证值必须为数组

                    // 网址规则
                    url: rules.url('网址'),

                    // 整数规则(包含0)
                    integer1: rules.integer('人数'),
                    integer2: rules.integer('人数', 100), // 最大值100
                    integer3: rules.integer('人数', 100, 10), // 10-100
                    // 自行新增规则
                    integer4: [
                        ...rules.integer('人数'),
                        {
                            validator,
                            trigger: 'blur'
                        }
                    ],

                    // 整数或浮点数
                    integer_float: rules.integer_float('人数', 2, 100, 10), // 10-100

                    // 金额规则 rules.money('提示文字', 最大值, 最小值)
                    money: rules.money('金额', 0.8, 0),

                    // 手机号规则
                    phone: rules.phone('手机号码'),

                    // 银行卡规则
                    bank_card: rules.bank_card('银行卡'),

                    // 身份证规则
                    idcard: rules.bank_card('身份证'),

                    // 邮箱
                    email: rules.email('邮箱'),

                    // QQ
                    email: rules.qq('QQ号码'),
                }
            }
        }
    }
}
```

### TuNiao-UI

```html
<TnForm ref="formRef" :model="formData" :rules="formRules" label-width="140">
    <TnFormItem label="用户名" prop="username">
        <TnInput v-model="formData.username" size="sm" />
    </TnFormItem>
    <TnFormItem label="密码" prop="password">
        <TnInput v-model="formData.password" size="sm" type="password" />
    </TnFormItem>
</TnForm>
```
```ts
import type { FormItemRule, FormRules, TnFormInstance } from '@tuniao/tnui-vue3-uniapp'
import rules from '@lincy/async-validation'

const formRef = ref<TnFormInstance>()

// 表单数据
const formData = reactive({
    username: '',
    password: '',
})

// 规则
const formRules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
        {
            pattern: /^[\w-]{4,16}$/,
            message: '请输入4-16位英文、数字、下划线、横线',
            trigger: ['change', 'blur'],
        },
    ],
    password: rules.string('密码', 16, 6) as FormItemRule[],
}
```

License

MIT
