#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAMANHO_TEXTO 100
#define MAX_TENTATIVAS 3

typedef enum {
    ESPECIE_INVALIDA = 0,
    CAO = 1,
    GATO,
    AVE,
    PEQUENO_MAMIFERO,
    REPTIL,
    PEIXE,
    EQUINO,
    BOVINO,
    SILVESTRE_EXOTICO,
    OUTRA_ESPECIE
} TipoEspecie;

static int ler_opcao(int minimo, int maximo) {
    char linha[32];
    char *fim;
    long valor;

    if (fgets(linha, sizeof(linha), stdin) == NULL) {
        return -1;
    }

    valor = strtol(linha, &fim, 10);
    if (fim == linha || (*fim != '\n' && *fim != '\0') || valor < minimo || valor > maximo) {
        return -1;
    }

    return (int)valor;
}

static int ler_texto(const char *rotulo, char *destino, size_t capacidade) {
    size_t comprimento;

    printf("%s", rotulo);
    if (fgets(destino, (int)capacidade, stdin) == NULL) {
        return 0;
    }

    comprimento = strlen(destino);
    if (comprimento > 0 && destino[comprimento - 1] == '\n') {
        destino[comprimento - 1] = '\0';
    } else {
        int caractere;
        while ((caractere = getchar()) != '\n' && caractere != EOF) {
        }
    }

    return destino[0] != '\0';
}

static TipoEspecie selecionar_especie(void) {
    int tentativa;
    int opcao;

    for (tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
        printf("\nSelecione o grupo da especie:\n");
        printf("1. Cao\n");
        printf("2. Gato\n");
        printf("3. Ave\n");
        printf("4. Pequeno mamifero\n");
        printf("5. Reptil\n");
        printf("6. Peixe\n");
        printf("7. Equino\n");
        printf("8. Bovino\n");
        printf("9. Silvestre ou exotico\n");
        printf("10. Outra especie\n");
        printf("Opcao: ");

        opcao = ler_opcao(1, 10);
        if (opcao >= 1 && opcao <= 10) {
            return (TipoEspecie)opcao;
        }

        printf("Opcao invalida.\n");
    }

    return ESPECIE_INVALIDA;
}

int main(void) {
    char animal[TAMANHO_TEXTO];
    char responsavel[TAMANHO_TEXTO];
    TipoEspecie especie;
    int confirmacao;

    printf("=== Cadastro demonstrativo - Clinica Veterinaria ===\n");
    printf("Este programa e uma demonstracao local; nao armazena prontuarios.\n");
    if (!ler_texto("Nome do animal: ", animal, sizeof(animal)) ||
        !ler_texto("Nome do responsavel: ", responsavel, sizeof(responsavel))) {
        printf("Cadastro cancelado: informe os nomes do animal e do responsavel.\n");
        return 1;
    }

    especie = selecionar_especie();
    if (especie == ESPECIE_INVALIDA) {
        printf("Cadastro cancelado por falta de uma selecao valida.\n");
        return 1;
    }

    printf("\nConfirme que a equipe tem competencia e estrutura para esta especie\n");
    printf("e que os requisitos legais e documentos aplicaveis foram conferidos.\n");
    printf("1. Confirmar conferencias\n");
    printf("2. Deixar pendente\n");
    printf("Opcao: ");
    confirmacao = ler_opcao(1, 2);

    printf("\nPaciente: %s\nResponsavel: %s\n", animal, responsavel);
    printf("Situacao: %s\n", confirmacao == 1
        ? "conferencias confirmadas pela equipe"
        : "pendente de conferencia pela equipe");
    printf("A confirmacao nao substitui avaliacao veterinaria ou verificacao oficial.\n");

    return 0;
}
