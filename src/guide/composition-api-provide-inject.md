# 提供/注入

> 本指南假定你已经阅读了 [Provide / Inject](component-provide-inject.html)、[Composition API Introduction](composition-api-introduction.html) 和[响应式基础](reactivity-fundamentals.html)。如果你不熟悉组合 API，请先阅读这篇文章。

我们可以使用 [provide/inject](component-provide-inject.html) 以及 Composition API。两者都只能在当前活动实例的 [`setup()`](composition-api-setup.html) 期间调用。

## 设想场景

Let's assume that we want to rewrite the following code，which contains a `MyMap` component that provides a `MyMarker` component with the user's location，using the Composition API。

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  provide: {
    location: 'North Pole',
    geolocation: {
      longitude: 90,
      latitude: 135
    }
  }
}
</script>
```

```vue
<!-- src/components/MyMarker.vue -->
<script>
export default {
  inject: ['location', 'longitude', 'latitude']
}
</script>
```

## 使用 Provide

在 `setup()` 中使用 `provide` 时，我们首先从 `vue` 显式导入方法。这使我们可以用它自己的 `provide` 调用来定义每个 property。

 `provide` 函数允许你通过两个参数定义 property：

1. property 的 name (`<String>` 类型)
2. property 的 value

使用 `MyMap` 组件，我们提供的值可以重构如下：

```vue{7,14-20}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide } from 'vue'
import MyMarker from './MyMarker.vue

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
</script>
```

## 使用注入

在 `setup()` 中使用 `inject` 时，还需要从 `vue` 显式导入它。一旦我们这样做了，我们就可以调用它来定义如何将它暴露给我们的组件。

`inject` 函数有两个参数：

1. 要注入的 property 的名词
2. 一个默认的值 (**可选**)

使用 `MyMarker` 组件，可以使用以下代码对其进行重构：

```vue{3,6-14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

## 响应式

### 添加响应式

为了增加提供值和注入值之间的响应式，我们可以使用 [ref](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) 或 [reactive](reactivity-fundamentals.html#declaring-reactive-state) 提供值时。

使用 `MyMap` 组件，我们的代码可以更新如下：

```vue{7,15-22}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```


现在，如果这两个 property 中有任何更改，`MyMarker` 组件也将自动更新！如下：

### 多个响应式 property


当使用响应式提供/注入值时，**建议在可能的情况下，将任何对响应式 property 的更改保存在*提供者*内**。

例如，在需要更改使用者位置的情况下，我们最好在 `MyMap` 组件中执行此操作。

```vue{28-32}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)

    return {
      location
    }
  },
  methods: {
    updateLocation() {
      this.location = 'South Pole'
    }
  }
}
</script>
```

但是，有时我们需要更新注入数据的组件内部的数据。在这种情况下，我们建议提供一种方法来负责改变响应式 property。

``` vue{21-23,27}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', location)
    provide('geolocation', geolocation)
    provide('updateLocation', updateLocation)
  }
}
</script>
```

```vue{9,14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateUserLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
```

最后，如果要确保通过 `provide` 传递的数据不会被注入的组件更改，我们建议对提供者 property 使用` readonly。

```vue{7,25-26}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  }
}
</script>
```
