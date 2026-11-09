# Clínica Veterinária Vitta

Protótipo local de um sistema de gestão para clínica veterinária com pacientes de diferentes grupos de espécies, incluindo animais de companhia, aves, pequenos mamíferos, répteis, peixes, animais de produção e espécies silvestres ou exóticas.

## Interface web

Abra `index.html` em um navegador. Os estilos ficam em `styles.css` e as funcionalidades da página em `script.js`. O protótipo permite:

- Consultar o painel e a agenda de atendimentos.
- Cadastrar pacientes e seus responsáveis, com contato e situação da documentação.
- Informar a espécie específica, além de escolher um grupo animal amplo.
- Buscar pacientes por nome, espécie, responsável ou telefone.
- Agendar consultas, retornos, vacinação, procedimentos e triagens.
- Identificar cadastros com documentação pendente.

Os registros são mantidos apenas na memória da página e se perdem ao recarregar ou fechar o navegador. Não use dados reais de clientes ou pacientes. Não há servidor, autenticação, prontuário clínico, integração com serviços externos ou validação de documentos.

O cadastro de uma espécie não significa que ela possa ser atendida em qualquer clínica. A equipe deve avaliar a competência profissional e a estrutura disponíveis, confirmar as exigências legais e a documentação aplicável e encaminhar o paciente quando necessário. Situações urgentes devem ser triadas sem demora indevida por causa de tarefas administrativas.

## Demonstração em C

`main.c` é um exemplo independente de fluxo de cadastro pelo terminal. Não armazena dados nem controla equipamentos.

Com GCC:

```sh
gcc main.c -std=c11 -Wall -Wextra -Wpedantic -o cadastro_veterinario
./cadastro_veterinario
```

No Windows, execute `cadastro_veterinario.exe`.
