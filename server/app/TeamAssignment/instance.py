import pandas as pd


class Data:
    id = []
    name = []
    position = []
    cost = []
    score = []
    gama = []
    posUnique = []
    media = []
    dataDir = 0
    df = None

    def __init__(self, dataDir, previous, r):
        self.dataDir = dataDir
        self.df = pd.read_csv(dataDir, index_col=0)

        self.df.drop(
            [
                "atletas.slug",
                "atletas.apelido",
                "atletas.foto",
                "atletas.rodada_id",
                "atletas.jogos_num",
                "atletas.clube.id.full.name",
                "FF",
                "FS",
                "G",
                "PI",
                "CA",
                "FC",
                "DS",
                "FT",
                "DD",
                "GS",
                "FD",
                "GC",
                "SG",
                "A",
                "I",
                "CV",
                "PP",
            ],
            axis=1,
            inplace=True,
            errors="ignore",
        )

        self.df["atletas.posicao_id"] = pd.Categorical(
            self.df["atletas.posicao_id"], ["tec", "gol", "zag", "lat", "mei", "ata"]
        )

        self.df = self.df.sort_values("atletas.posicao_id")

        if r > 1:
            self.previous = pd.read_csv(previous, index_col=0)
            self.previous = self.previous[
                self.previous["atletas.status_id"].str.contains("Provável") == True
            ]
            ids = self.previous["atletas.atleta_id"].unique()
            self.df = self.df[self.df["atletas.atleta_id"].isin(ids)]
        else:
            self.df = self.df[self.df["atletas.status_id"].str.contains("Provável") == True]
        # self.df = self.df[self.df["atletas.status_id"].str.contains("Lesionado")==False]

        self.id = self.df["atletas.atleta_id"].tolist()
        self.name = self.df["atletas.nome"].tolist()
        self.position = self.df["atletas.posicao_id"].tolist()
        self.cost = (self.df["atletas.preco_num"] - self.df["atletas.variacao_num"]).tolist()
        self.new_cost = self.df["atletas.preco_num"].tolist()
        self.score = self.df["atletas.pontos_num"].tolist()
        self.media = self.df["atletas.media_num"].tolist()
        self.posUnique = self.df["atletas.posicao_id"].unique().tolist()

        self.gama = []
        for i in self.posUnique:
            auxList = []
            for j in range(len(self.position)):
                if self.position[j] == i:
                    auxList.append(j)
            self.gama.append(auxList)
