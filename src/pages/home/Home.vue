<template>
 <div>
   <input type="text" v-model="message" placeholder="mensagem">
   <Button label="Send" @click="sendMessage"/>

    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
 </div>

 <canvas id="draw_board" width="600" height="800" style="border: 1px solid #000;"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from "primevue/button"
import socket from '../../service/socket';

const message = ref<string>("");
const messages = ref<string[]>([])

const sendMessage = () => {
  socket.emit('message', message.value)
}

onMounted(() => {
  socket.on('message', (msg) => {
    messages.value.push(msg);
  });
})


const moveFromTo = (context: CanvasRenderingContext2D, from: {x: number, y: number}, to: {x: number, y: number}, size: number) => {
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.strokeStyle = 'black'
    context.lineWidth = size
    context.stroke()
}


onMounted(() => {
  const canvas = document.getElementById('draw_board') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')
  
  console.log(ctx)

  if(ctx){
    ctx.fillStyle = 'blue'
    // x, y , largura, altura
    ctx.fillRect(50, 50, 100, 100)


    //Retangulo stroked
    ctx.strokeStyle = 'red'
    ctx.strokeRect(200, 50, 100, 100);


    ctx.beginPath();
    ctx.arc(180, 200, 40, 0, 2 * Math.PI)
    ctx.fillStyle = 'green'
    ctx.fill()
    ctx.stroke();

    //LINHAS
    moveFromTo(ctx, { x: 10, y: 350}, { x: 500, y: 400}, 1)
  }
  
})







</script>

<style scoped>

</style>