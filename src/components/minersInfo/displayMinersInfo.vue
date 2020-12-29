<template>
    <div class="container mb-5">
        <p>Address is: {{ this.$store.state.minersaddress }}</p>
        <!-- <h3>Miner's Info: </h3>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">STX Address</th>
                    <th scope="col">BTC Address</th>
                    <th scope="col">Actual Blocks Won</th>
                    <th scope="col">Total Number of Blocks Won</th>
                    <th scope="col">Total Blocks Mined</th>
                    <th scope="col">Total Miner Mined</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="miner in miners" v-bind:key="miner.id" >
                    <th scope="row">{{miner.id}}</th>
                    <td>{{miner.stx_address}}</td>
                    <td>{{miner.btc_address}}</td>
                    <td>{{miner.actual_win}}</td>
                    <td>{{miner.total_win}}</td>
                    <td>{{miner.total_mined}}</td>
                    <td>{{miner.miner-burned}}</td>
                </tr>
            </tbody>
        </table> -->
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'displayMinersInfo',
  data () {
    return {
      miners: null
    }
  },
  created: function () {
    axios
      .get('https://jsonplaceholder.typicode.com/users/')
      .then(res => {
        this.users = res.data
      })
  }
}
</script>

<style>
    h3 {
        margin-bottom: 5%;
    }
</style>
