import('./index.scss')
import func from './a'

if (process.env.NODE_ENV === "development") {
    console.log("dev")
} else {
    console.log("product")
}

func()
console.log("hello webpack 123sss")
