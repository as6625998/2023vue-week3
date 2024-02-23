import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data(){
    return{
      products:[],
      tempProduct: {
        imageUrl: ''
      },
      modalProduct: null,
      modalDel: null,
      isNew: false
    }
  },
  methods:{
    getProducts(){
      const api = `${apiUrl}/v2/api/${apiPath}/admin/products`;
      axios.get(api)
        .then(res =>{
          this.products = res.data.products
        })
        .catch(err =>{
          alert(err.data.message);
        });
    },
    openModal(status, product){
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.modalProduct.show()
      }else if(status === 'edit'){
        this.tempProduct = {...product}
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = []
        }
        this.isNew = false
        this.modalProduct.show()
      }else if(status === 'delete'){
        this.tempProduct = {...product}
        this.modalDel.show()
      }
    },
    updateProduct(){
      //新增
      let api = `${apiUrl}/v2/api/${apiPath}/admin/product`;
      let method = 'post'

      //更新
      if(!this.isNew){
        api = `${apiUrl}/v2/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }
      axios[method](api, { data: this.tempProduct })
        .then(res =>{
          this.getProducts()
          this.modalProduct.hide()
          this.tempProduct = {}
      })
    },
    deleteProduct(){
      const api = `${apiUrl}/v2/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(api)
      .then(res =>{
        this.getProducts()
        this.modalDel.hide()
    })
    }
  },
  mounted(){
    // 取得 Token（Token 僅需要設定一次）
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)adminAccount\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 夾帶token在header中，只要加入一次就可以重複使用
    axios.defaults.headers.common['Authorization'] = token;
    this.getProducts()

    this.modalProduct = new bootstrap.Modal(this.$refs.productModal)
    this.modalDel = new bootstrap.Modal(this.$refs.delProductModal)
  }
})

app.mount('#app')