import { Note } from '../../src/services/Game'

export const mockNote = (id: string): Note => ({
    timestamp: '2022-01-01T00:00:00.000Z',
    id,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse molestie turpis ac gravida ultrices. Cras volutpat aliquam turpis, vitae eleifend ante porta eget. Integer pretium pharetra faucibus. Proin ullamcorper, lectus vitae accumsan ultrices, odio massa pretium nisi, eget viverra est lectus ac arcu. Pellentesque in efficitur nunc.'
})
