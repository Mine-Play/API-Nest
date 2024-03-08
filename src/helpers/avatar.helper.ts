import MinecraftSkinConverter from 'minecraft-skin-converter';

export class Avatar {
    static async classic(skin) {
        const converter = new MinecraftSkinConverter(skin, 'buffer/png');
        const head = await converter.getSkinHead(64);
        return 'data:image/png;base64,' + head.data.toString('base64');
    }
}