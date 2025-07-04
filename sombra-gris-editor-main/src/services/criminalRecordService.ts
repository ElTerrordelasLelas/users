
// Servicio para manejar la comunicación con FastAPI
export interface CriminalRecordData {
  id?: string;
  fileNumber: string;
  purpose: string;
  sruId: string;
  name: string;
  recordId: string;
  pronouns: string;
  age: string;
  sexuality: string;
  nationality: string;
  mbti: string;
  favs: {
    girlsGeneration: string;
    aespa: string;
    taylorSwift: string;
    jessicaJung: string;
    casual: string;
  };
  bvf: string;
  dfi: string;
  nonKpop: string;
  likes: string;
  dislikes: string;
  createdAt?: string;
  updatedAt?: string;
}

class CriminalRecordService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async createRecord(record: CriminalRecordData): Promise<CriminalRecordData> {
    console.log('Creating record:', record);
    
    const response = await fetch(`${this.baseUrl}/api/criminal-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_number: record.fileNumber,
        purpose: record.purpose,
        sru_id: record.sruId,
        name: record.name,
        record_id: record.recordId,
        pronouns: record.pronouns,
        age: record.age,
        sexuality: record.sexuality,
        nationality: record.nationality,
        mbti: record.mbti,
        favs: {
          girls_generation: record.favs.girlsGeneration,
          aespa: record.favs.aespa,
          taylor_swift: record.favs.taylorSwift,
          jessica_jung: record.favs.jessicaJung,
          casual: record.favs.casual,
        },
        bvf: record.bvf,
        dfi: record.dfi,
        non_kpop: record.nonKpop,
        likes: record.likes,
        dislikes: record.dislikes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getRecord(id: string): Promise<CriminalRecordData> {
    console.log('Getting record:', id);
    
    const response = await fetch(`${this.baseUrl}/api/criminal-records/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async updateRecord(id: string, record: Partial<CriminalRecordData>): Promise<CriminalRecordData> {
    console.log('Updating record:', id, record);
    
    const response = await fetch(`${this.baseUrl}/api/criminal-records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_number: record.fileNumber,
        purpose: record.purpose,
        sru_id: record.sruId,
        name: record.name,
        record_id: record.recordId,
        pronouns: record.pronouns,
        age: record.age,
        sexuality: record.sexuality,
        nationality: record.nationality,
        mbti: record.mbti,
        favs: record.favs ? {
          girls_generation: record.favs.girlsGeneration,
          aespa: record.favs.aespa,
          taylor_swift: record.favs.taylorSwift,
          jessica_jung: record.favs.jessicaJung,
          casual: record.favs.casual,
        } : undefined,
        bvf: record.bvf,
        dfi: record.dfi,
        non_kpop: record.nonKpop,
        likes: record.likes,
        dislikes: record.dislikes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteRecord(id: string): Promise<void> {
    console.log('Deleting record:', id);
    
    const response = await fetch(`${this.baseUrl}/api/criminal-records/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }

  async getAllRecords(): Promise<CriminalRecordData[]> {
    console.log('Getting all records');
    
    const response = await fetch(`${this.baseUrl}/api/criminal-records`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

export const criminalRecordService = new CriminalRecordService();
