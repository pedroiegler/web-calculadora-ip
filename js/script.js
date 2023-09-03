const ipMaskEditText = document.getElementById("ip_mask_edit_text");
const resultados = document.getElementById("resultados");
const btnCalculate = document.getElementById("calcular");
  
//192.168.0.1/24
//10.0.0.1/8
//172.16.0.1/16
//c


function calculateNetworkType(address) {
  const firstOctet = parseInt(address.split(".")[0], 10);
  if (firstOctet >= 1 && firstOctet <= 127) {
    return "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    return "C";
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    return "D";
  } else {
    return "E";
  }
}

btnCalculate.addEventListener("click", () => {

    
    const address = ipMaskEditText.value;
    const maskArray = address.split("/");
    const mask = maskArray[1];
    if(address == ""){
      resultados.innerHTML = `<p>Por favor, digite um Endereço de IP/Máscara de sub-rede!</p>`;
    }
    else{

      const addressRegex = /^(\d{1,3}\.){3}\d{1,3}\/(0|[1-9]\d?)$/;


      if (!addressRegex.test(address)) {
        resultados.innerHTML = "<p>Endereço de IP/Máscara de sub-rede inválido<br>Por favor, digite um endereço no formato x.x.x.x/n</p>";
        return;
      }
      else{

        const networkType = calculateNetworkType(address);

        const subnetMask = cidrToSubnetMask(mask);
        const networkAddress = calculateNetworkAddress(address, subnetMask);
        const broadcastAddress = calcularEnderecoBroadcast(address, subnetMask.join("."));
        const numIps = calculateNumIps(mask);
        const inverseMask = calcularMascaraInversa(subnetMask.join("."));
        const firstIp = calculateFirstIp(networkAddress);
        const lastIp = calculateLastIp(broadcastAddress);

        
        
        function cidrToSubnetMask(cidr) {
          const numOnes = cidr;
          const numZeros = 32 - numOnes;
          const subnetMask = Array(32)
            .fill()
            .map((_, i) => {
              if (i < numOnes) {
                return 1;
              } else if (i < numOnes + numZeros) {
                return 0;
              } else {
                throw new Error("Invalid CIDR notation");
              }
            });
          return subnetMask
            .reduce((acc, curr, i) => {
              if (i % 8 === 0) {
                acc.push([]);
              }
              acc[acc.length - 1].push(curr);
              return acc;
            }, [])
            .map((byte) => parseInt(byte.join(""), 2));
        }
        
        function calculateNetworkAddress(address, subnetMask) {
          const addressBytes = address.split(".").map((octet) => parseInt(octet, 10));
          const networkAddressBytes = addressBytes.map((byte, i) => byte & subnetMask[i]);
          return networkAddressBytes.join(".");
        }
        
        function calcularEnderecoBroadcast(enderecoIpRede, mascaraSubrede) {
          const enderecoIpRedeLista = enderecoIpRede.split(".").map((octet) => parseInt(octet, 10));
          const mascaraSubredeLista = mascaraSubrede.split(".").map((octet) => parseInt(octet, 10));
          const enderecoBroadcastLista = enderecoIpRedeLista.map((byte, i) => {
          //const broadcastByte = byte | ~mascaraSubredeLista[i];
          const broadcastByte = byte | (255 - mascaraSubredeLista[i]);
          return broadcastByte >>> 0;
          });
          const enderecoBroadcast = enderecoBroadcastLista.join(".");
          return enderecoBroadcast;
        }
        
        function calculateNumIps(numBits) {
          return Math.pow(2, 32 - numBits) - 2;
        }
        
        
        function calcularMascaraInversa(mascaraSubrede) {
          const mascaraSubredeLista = mascaraSubrede.split(".").map((octet) => parseInt(octet, 10));
          const mascaraInversaLista = mascaraSubredeLista.map((byte) => (255 - byte).toString());
          const mascaraInversa = mascaraInversaLista.join(".");
          return mascaraInversa;
        }
        
        function calculateFirstIp(networkAddress) {
          const addressBytes = networkAddress.split(".").map((octet) => parseInt(octet, 10));
          addressBytes[3] += 1;
          return addressBytes.join(".");
        }
        
        function calculateLastIp(broadcastAddress) {
          const addressBytes = broadcastAddress.split(".").map((octet) => parseInt(octet, 10));
          addressBytes[3] -= 1;
          return addressBytes.join(".");
        }
      
        resultados.innerHTML = `
          <table border=1>
              <tr style="background-color: #f6f6f6;">
                  <td>Tipo de Rede:</td>
                  <td>${networkType}</td>
              </tr>

              <tr>
                  <td>Endereço de Rede:</td>
                  <td>${networkAddress}</td>
              </tr>

              <tr style="background-color: #f6f6f6;">
                  <td>Endereço de Broadcast:</td>
                  <td>${broadcastAddress}</td>
              </tr>

              <tr>
                  <td>Número de IPs disponíveis:</td>
                  <td>${numIps}</td>
              </tr>

              <tr style="background-color: #f6f6f6;">
                  <td>Máscara de sub-rede inversa:</td>
                  <td>${inverseMask}</td>
              </tr>
              
              <tr>
                  <td>Primeiro IP disponível:</td>
                  <td>${firstIp}</td>
              </tr>

              <tr style="background-color: #f6f6f6;">
                  <td>Último IP disponível:</td>
                  <td>${lastIp}</td>
              </tr>
          </table>
        `;
      }
    }
});
  
  
  
  
  