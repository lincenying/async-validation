# async-validation

async-validator 验证规则, 凡使用async-validator的UI库都可用

##### install

```bash
yarn add @lincy/async-validation
# or
pnpm add @lincy/async-validation -D
```

### string
```ts
function string(text: string, maxLength?: number, minLength?: number, trigger?: string[] | string, required?: boolean): RulesType[]
```
字符串类型, 即一般文本框
- @param text 字段名
- @param maxLength 最大长度
- @param minLength 最小长度
- @param trigger 动作: change, blur
- @param required 是否能为空
- @returns RulesType[]

### letter_number
```ts
function letter_number(text: string, maxLength?: number, minLength?: number, trigger?: string[] | string, required?: boolean): RulesType[]
```
只允许字母或数字
- @param text 字段名
- @param maxLength 最大长度
- @param minLength 最小长度
- @param trigger 动作: change, blur
- @param required 是否能为空
- @returns RulesType[]

### select
```ts
function select(text: string, multiple?: boolean): RulesType[]
```
选择类型, 如 单选框, 复选框, 下拉框 之类的
- @param text 字段名
- @param multiple 是否为数组 默认: false
- @returns RulesType[]

### url
```ts
function url(text: string, required?: boolean): RulesType[]
```
Url网址
- @param text 字段名
- @param required 是否能为空
- @returns RulesType[]

### integer
```ts
function integer(text: string, maximum?: number, minimum?: number, trigger?: string[] | string, required?: boolean): RulesType[]
```
整数(包含0, 负整数), 通过正则匹配, 可限制最大值最小值
- @param text 字段名
- @param maximum 最大值
- @param minimum 最小值
- @param trigger 动作: change, blur
- @param required 是否能为空
- @returns RulesType[]

### integer_float
```ts
function integer_float(text: string, precision?: number, maximum?: number, minimum?: number, trigger?: string[] | string, required?: boolean): RulesType[]
```
整数或者浮点数(包含0和负数), 通过正则匹配, 可限制最大值最小值
- @param text 字段名
- @param precision 小数点位数
- @param maximum 最大值
- @param minimum 最小值
- @param trigger 动作: change, blur
- @param required 是否能为空
- @returns RulesType[]

### money
```ts
function money(text: string, maximum?: number, minimum?: number, trigger?: string[] | string, required?: boolean): RulesType[]
```
金额类型, 通过正则验证, 支持小数点后两位, 且可以限制最大值和最小值
- @param text — 字段名
- @param maximum — 最大值
- @param minimum — 最小值
- @param trigger — 动作: change, blur
- @param required — 是否能为空
- @returns — RulesType[]

### phone
```ts
function phone(text: string, required?: boolean): RulesType[]
```
国内通用手机号码
- @param text — 字段名
- @param required — 是否能为空
- @returns — RulesType[]

### bank_card
```ts
function bank_card(text: string, required?: boolean): RulesType[]
```
国内通用银行卡
- @param text — 字段名
- @param required — 是否能为空
- @returns — RulesType[]

## 示例

#### 组合式
```html
<template>
    <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="旧密码：" label-width="120px" prop="string1">
            <el-input v-model="form.string1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" label-width="120px" prop="string2">
            <el-input v-model="form.string2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" label-width="120px" prop="string3">
            <el-input v-model="form.string3" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import rules from '@lincy/async-validation'

const form = reactive({
    string1: '',
    string2: '',
    string3: '',
    int1: '',
    int2: ''
})

const formRef = ref()

const rules = {
    string1: rules.string('旧密码'),
    string2: [
        ...rules.string('新密码', undefined, 6), // 最短6位
        {
            validator: (_rule, _value, callback) => {
                formRef.value?.validateField('string3')
                callback()
            },
        }
    ],
    string3: [
        ...rules.string('确认密码', 16, 6), // 6-16位
        {
            validator: (_rule, value, callback) => {
                if (form.string2 !== value) {
                    return callback(new Error('两次密码输入不一致'))
                }
                callback()
            },
        },
    ],
}
</script>
```

#### 选项式
```html
<template>
    <el-form :model="data.form" :rules="data.rules" ref="formRef">
        <el-form-item label="旧密码：" label-width="120px" prop="string1">
            <el-input v-model="data.form.string1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" label-width="120px" prop="string2">
            <el-input v-model="data.form.string2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" label-width="120px" prop="string3">
            <el-input v-model="data.form.string3" auto-complete="off"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
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
                    string1: rules.string('旧密码'),
                    string2: rules.string('新密码', undefined, 6), // 最短6位
                    string3: rules.string('确认密码', 16, 6), // 6-16位

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
</script>
```

### TuNiao-UI

```vue
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
