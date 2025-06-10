<template>
 <!-- <div>
  <div style="max-width: 220px;">
    <Textarea rows="3" placeholder="mensagem" size="large"/><br>
    <Button fluid label="Send" @click="sendMessage"/>
  </div>

    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
 </div> -->

 <div class="options">
  <Slider id="brush_size" v-model="BRUSH_SIZE" :min="1" :max="100" class="w-56" />
  <ColorPicker v-model="BRUSH_COLOR" inline/>
  <Button @click="gerarImagem" fluid severity="info" label="gera imagem"/>
  <Button @click="baixarImagem" fluid severity="help" label="baixar imagem"/>
 </div>

 <div>
  <div class="bg-red-500 flex justify-center">
    <span v-if="player?.isHost">HOST</span>
  </div>
   <InputGroup>
    <InputText v-model="newNick" placeholder="novo nick"/>
    <Button @click="updateNick" label="atualizar nick"/>
   </InputGroup>
  <br>
  <ul>
    <li v-for="(player, index) in players" :key="index">{{ player.nick }}</li>
  </ul>
 </div>

 <div style="display: flex; justify-content: center; margin-top: 50px;">
   <canvas @mousedown="drawing = true" @mouseup="stopDraw" @mousemove="draw($event)" id="draw_board" width="600" height="800" style="border: 1px solid #000;"></canvas>
 </div>

 <div id="image-container">

 </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import socket from '../../service/socket';
import { ColorPicker, InputGroup, Slider, Textarea } from 'primevue';

const message = ref<string>("");
const messages = ref<string[]>([])
const drawing = ref(false);
const canvas = ref<HTMLCanvasElement | null>();
const ctx = ref<CanvasRenderingContext2D | null>();
const BRUSH_SIZE = ref(3);
const BRUSH_COLOR = ref('BLACK');
const image = ref<string | null>(null);
const players = ref<Player[]>([])
const player = ref<Player>()
const newNick = ref('');
const uuid = ref(crypto.randomUUID())

const sendMessage = () => {
  socket.emit('message', message.value)
}

const updateNick = () => {
  if(newNick.value && newNick.value.length > 0){
    socket.emit('change-nick', newNick.value)
  }
}

interface Player {
  id: string,
  nick: string,
  isHost: boolean,
  uuid: string
}

onMounted(() => {
  // socket.on('message', (data) => {
  //   // messages.value.push(data);

  //   const blob = new Blob([data], { type: 'image/png' });

  //   const img = new Image();
  //   img.src = URL.createObjectURL(blob);
  //   img.alt = 'Imagem recebida';
  //   img.className = 'imagem-recebida'; // Você pode estilizar com CSS

  //   // Insere no DOM, por exemplo em um container
  //   const container = document.getElementById('image-container');
  //   if (container) {
  //     container.appendChild(img);
  //   }

  //   // Libera memória depois que a imagem carregar
  //   img.onload = () => {
  //     URL.revokeObjectURL(img.src);
  //   };
  // });

  socket.emit('join', uuid.value)



  socket.on('updated-players', (onlinePlayers: Player[]) => {
    players.value = onlinePlayers;
    player.value = onlinePlayers.find(p => p.uuid === uuid.value)
  })
})


const moveFromTo = (context: CanvasRenderingContext2D, from: {x: number, y: number}, to: {x: number, y: number}, size: number) => {
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.strokeStyle = 'black'
    context.lineWidth = size
    context.stroke()
    context.beginPath()
}

const stopDraw = () => {
  drawing.value = false;
  ctx.value?.beginPath();
}

const draw = (event: MouseEvent) => {
  if(!!canvas.value && !!ctx.value){
    if(!drawing.value) return;

    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    ctx.value.lineWidth = BRUSH_SIZE.value;
    ctx.value.lineCap = 'round'
    ctx.value.strokeStyle = `#${BRUSH_COLOR.value}`

    ctx.value.lineTo(x, y)
    ctx.value.stroke()
    ctx.value.beginPath()
    ctx.value.moveTo(x, y)
  }
}

const gerarImagem = () => {
  if (!canvas.value) return;
  canvas.value.toBlob((blob) => {
    if(blob){
      blob.arrayBuffer().then((buffer) => {
         socket.emit('message', buffer)
      })
    }
  }, 'image/png', 0.8);
};

const baixarImagem = () => {
  if (!canvas.value) return;
  const link = document.createElement('a');
  link.href = canvas.value.toDataURL('image/png');
  link.download = 'meu-desenho.png';
  link.click();
};

onMounted(() => {

  canvas.value = document.getElementById('draw_board') as HTMLCanvasElement
  ctx.value = canvas.value.getContext('2d')

  
  console.log(ctx)

  if(ctx.value){
    // ctx.value.fillStyle = 'blue'
    // // x, y , largura, altura
    // ctx.value.fillRect(50, 50, 100, 100)


    // //Retangulo stroked
    // ctx.value.strokeStyle = 'red'
    // ctx.value.strokeRect(200, 50, 100, 100);


    // ctx.value.beginPath();
    // ctx.value.arc(180, 200, 40, 0, 2 * Math.PI)
    // ctx.value.fillStyle = 'green'
    // ctx.value.fill()
    // ctx.value.stroke();

    // //LINHAS
    // moveFromTo(ctx.value, { x: 10, y: 350}, { x: 500, y: 400}, 1)
  }
  
})







</script>

<style scoped>
.options{
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

#brush_size{
  width: 15rem;
}
</style>