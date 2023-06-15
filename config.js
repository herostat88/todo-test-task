// Настройки БД
export const MONGO_URL = 'mongodb://localhost/todo-test-task'
export const MONGO_OPT = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true, 
    autoCreate: true, 
    useCreateIndex: true 
}

// Настройки токена авторизации
export const JWT_SECRET = 'testtodo123'
export const JWT_EXPIRE = '9999 years'

