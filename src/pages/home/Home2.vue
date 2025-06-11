<template>
  <div class="bg-[#2B2B2B] w-full h-12 flex justify-center items-center font-medium text-white text-lg gap-3 fixed"> <i class="pi pi-discord text-[#5662F6] !text-2xl"></i> <span>Beta aberta! Entre no nosso discord</span></div>
  <div v-confetti="{ particleCount: 350, force: 0.5, duration: 5000, destroyAfterDone: true, stageWidth: 4000, stageHeight: 1000 }" />
  <div 
    :style="{backgroundImage: `url(${wallpaper})`}" 
    class="w-screen h-screen bg-cover bg-center flex items-center"
  >
    <div class="w-72 h-[90%] glass ml-5 flex flex-col items-center overflow-auto">
      <span class="mt-2.5 text-2xl text-white font-sans bg-green-500 rounded-[10px] p-3"><span v-if="player?.isHost">👑</span>{{ player?.nick }}</span>
      <span v-for="player in players" :class="{'hidden' : isYou(player.uuid)}" class="mt-2.5 text-2xl text-white font-sans bg-purple-600 rounded-[10px] p-3">
       <span v-if="player.isHost">👑</span> {{ player.nick }}
      </span>
    </div>
    <div class="w-full h-full flex flex-col items-center justify-between">
      <div class="mt-16">
        <InputText class="!border-purple-600" v-model="newNick" height="16px" width="16px" placeholder="Escreva seu novo nick" />
        <Button @click="updateNick" class=" hover:!bg-purple-400 ml-3 !bg-purple-600 !border-purple-600" label="Atualizar" />
      </div>
      <div class="mb-16">
        <Button :pt="{label: 'text-[26px]'}" class="animate-bounce h-24 w-96 hover:!bg-purple-400 ml-3 !bg-purple-600 !border-purple-600" label="Começar" />
      </div>
    </div>

  </div>
</template>

<script setup lang='ts'>

  import wallpaper from '../../assets/imgs/WallpaperGarticClone.jpg'
  import { vConfetti } from '@neoconfetti/vue';
  import { onMounted, ref } from 'vue';
  import Button from "primevue/button"
  import InputText from "primevue/inputtext"
  import socket from '../../service/socket';
  import { ColorPicker, InputGroup, Message, Slider, Textarea } from 'primevue';

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

  const isYou = (uuid:string) => {
    if(uuid === player.value?.uuid){
      return true
    }else{
      false
    }
  }

  interface Player {
    id: string,
    nick: string,
    isHost: boolean,
    uuid: string
  }

  onMounted(() => {

    socket.on('message', (data) => {
      // messages.value.push(data);

      const blob = new Blob([data], { type: 'image/png' });

      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.alt = 'Imagem recebida';
      img.className = 'imagem-recebida'; // Você pode estilizar com CSS

      // Insere no DOM, por exemplo em um container
      const container = document.getElementById('image-container');
      if (container) {
        container.appendChild(img);
      }

      // Libera memória depois que a imagem carregar
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
    });

    socket.emit('join', uuid.value)



    socket.on('updated-players', (onlinePlayers: Player[]) => {
      players.value = onlinePlayers;
      player.value = onlinePlayers.find(p => p.uuid === uuid.value)

    })

    
    console.log(socket.id)
  })



</script>

<style scoped>
  .glass{
    background: rgba(81, 3, 184, 0.25);
    box-shadow: 0 8px 32px 0 rgba(38, 0, 73, 0.37);
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    border-radius: 10px;
    border: 1px solid rgba(124, 27, 235, 0.18);
  }
</style>