import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit3, User, Fingerprint, Plus, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { criminalRecordService, type CriminalRecordData } from '@/services/criminalRecordService';

interface CriminalRecord {
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
}

const CriminalRecordEditor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<CriminalRecordData[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [showRecordsList, setShowRecordsList] = useState(false);
  const { toast } = useToast();
  
  const [record, setRecord] = useState<CriminalRecord>({
    fileNumber: '#16062003-531',
    purpose: 'G-123074-9(P)',
    sruId: 'GOVT',
    name: 'KIMBERLY',
    recordId: 'T1389S12309',
    pronouns: 'S/HER',
    age: 'SEVENTEEN',
    sexuality: 'BISSEXUAL',
    nationality: 'BRAZILIAN',
    mbti: 'INFJ-T',
    favs: {
      girlsGeneration: 'TAEYEON',
      aespa: 'NING YIZHUO',
      taylorSwift: 'TAYLOR SWIFT',
      jessicaJung: 'JESSICA JUNG',
      casual: '2nd gen ggs, bigbang, ikon, blackpink, apink, winner.'
    },
    bvf: 'falo sobre meu dia-a-dia, kpop e pop no geral. não problematizo solo stan. esse perfil é uma monarquia onde snsd são as rainhas.',
    dfi: 'se você é only army/exol, bgsstan ou belieber. só faz tweet de ioração, floda fancam 24/7, é homofóbico racista etc critério básico.',
    nonKpop: 'beyoncé, olivia rodrigo, selena gomez, cardi b, destiny\'s child, megan thee stallion, sza, jorja smith, rihanna.',
    likes: 'filmes de terror/ficção científica, docomics, lasanha, frio e papagaios.',
    dislikes: 'gente que trata kpop com emprego, calor, azeitona, barulho.'
  });

  // Cargar todos los registros al montar el componente aaaaa
  useEffect(() => {
    loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    try {
      const allRecords = await criminalRecordService.getAllRecords();
      setRecords(allRecords);
      console.log('Loaded records:', allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros. Verifica que el servidor esté funcionando.",
        variant: "destructive",
      });
    }
  };

  const loadRecord = async (id: string) => {
    try {
      setIsLoading(true);
      const loadedRecord = await criminalRecordService.getRecord(id);
      
      // Convertir el formato de la API al formato del componente
      setRecord({
        id: loadedRecord.id,
        fileNumber: loadedRecord.fileNumber,
        purpose: loadedRecord.purpose,
        sruId: loadedRecord.sruId,
        name: loadedRecord.name,
        recordId: loadedRecord.recordId,
        pronouns: loadedRecord.pronouns,
        age: loadedRecord.age,
        sexuality: loadedRecord.sexuality,
        nationality: loadedRecord.nationality,
        mbti: loadedRecord.mbti,
        favs: {
          girlsGeneration: loadedRecord.favs.girlsGeneration,
          aespa: loadedRecord.favs.aespa,
          taylorSwift: loadedRecord.favs.taylorSwift,
          jessicaJung: loadedRecord.favs.jessicaJung,
          casual: loadedRecord.favs.casual,
        },
        bvf: loadedRecord.bvf,
        dfi: loadedRecord.dfi,
        nonKpop: loadedRecord.nonKpop,
        likes: loadedRecord.likes,
        dislikes: loadedRecord.dislikes,
      });
      
      setSelectedRecordId(id);
      setShowRecordsList(false);
      
      toast({
        title: "Éxito",
        description: "Registro cargado correctamente",
      });
    } catch (error) {
      console.error('Error loading record:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el registro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setRecord(prev => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof CriminalRecord] as object),
          [nested]: value
        }
      }));
    } else {
      setRecord(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (selectedRecordId) {
        // Actualizar registro existente
        await criminalRecordService.updateRecord(selectedRecordId, record);
        toast({
          title: "Éxito",
          description: "Registro actualizado correctamente",
        });
      } else {
        // Crear nuevo registro
        const newRecord = await criminalRecordService.createRecord(record);
        setSelectedRecordId(newRecord.id || null);
        toast({
          title: "Éxito",
          description: "Registro creado correctamente",
        });
      }
      
      setIsEditing(false);
      await loadAllRecords(); // Recargar la lista
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el registro. Verifica la conexión con el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRecord = () => {
    setRecord({
      fileNumber: '',
      purpose: '',
      sruId: '',
      name: '',
      recordId: '',
      pronouns: '',
      age: '',
      sexuality: '',
      nationality: '',
      mbti: '',
      favs: {
        girlsGeneration: '',
        aespa: '',
        taylorSwift: '',
        jessicaJung: '',
        casual: ''
      },
      bvf: '',
      dfi: '',
      nonKpop: '',
      likes: '',
      dislikes: ''
    });
    setSelectedRecordId(null);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-5xl mx-auto">
        {/* Lista de registros */}
        {showRecordsList && (
          <Card className="mb-6 p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Registros Guardados</h3>
              <Button 
                onClick={() => setShowRecordsList(false)}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                Cerrar
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((rec) => (
                <Card key={rec.id} className="p-4 bg-gray-800 border-gray-600 hover:bg-gray-700 cursor-pointer transition-colors">
                  <div onClick={() => rec.id && loadRecord(rec.id)}>
                    <h4 className="font-bold text-white mb-2">{rec.name}</h4>
                    <p className="text-sm text-gray-300 mb-1">ID: {rec.recordId}</p>
                    <p className="text-sm text-gray-300">Archivo: {rec.fileNumber}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Header exacto como la imagen */}
        <Card className="mb-6 p-6 bg-gray-900 border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-300" />
              </div>
              <div className="document-header text-white">
                <h1 className="text-3xl font-bold mb-1">Central Intelligence Agency</h1>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">CRIMINAL RECORD</h2>
                <p className="text-sm text-gray-400 font-mono">UNCLASSIFIED/FOUO</p>
              </div>
            </div>
            
            <div className="text-right space-y-2 text-white">
              <div className="field-label text-sm">
                FILE NUMBER: <span className="font-mono text-gray-300">{record.fileNumber}</span>
              </div>
              <div className="field-label text-sm">
                PURPOSE RECORD: <span className="font-mono text-gray-300">{record.purpose}</span>
              </div>
              <div className="field-label text-sm">
                SRU ID: <span className="font-mono text-gray-300">{record.sruId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              onClick={handleNewRecord}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
            <Button 
              onClick={() => setShowRecordsList(!showRecordsList)}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Ver Registros
            </Button>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "default"}
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            {isEditing && (
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Columna principal - Información personal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Información básica */}
            <Card className="p-6 bg-gray-900 border-gray-700">
              <h3 className="field-label text-lg mb-4 text-white border-b border-gray-600 pb-2">
                INFORMACIÓN BÁSICA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">NAME:</label>
                  {isEditing ? (
                    <Input 
                      value={record.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-lg text-white bg-gray-800 p-2 border border-gray-600">
                      {record.name}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">RECORD ID:</label>
                  {isEditing ? (
                    <Input 
                      value={record.recordId}
                      onChange={(e) => handleInputChange('recordId', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.recordId}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">PRONOUNS:</label>
                  {isEditing ? (
                    <Input 
                      value={record.pronouns}
                      onChange={(e) => handleInputChange('pronouns', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.pronouns}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">AGE:</label>
                  {isEditing ? (
                    <Input 
                      value={record.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.age}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">SEXUALITY:</label>
                  {isEditing ? (
                    <Input 
                      value={record.sexuality}
                      onChange={(e) => handleInputChange('sexuality', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.sexuality}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">NATIONALITY:</label>
                  {isEditing ? (
                    <Input 
                      value={record.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.nationality}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">MBTI:</label>
                  {isEditing ? (
                    <Input 
                      value={record.mbti}
                      onChange={(e) => handleInputChange('mbti', e.target.value)}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.mbti}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Favoritos */}
            <Card className="p-6 bg-gray-900 border-gray-700">
              <h3 className="field-label text-lg mb-4 text-white border-b border-gray-600 pb-2">
                FAVS...
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">GIRLS' GENERATION:</label>
                  {isEditing ? (
                    <Input 
                      value={record.favs.girlsGeneration}
                      onChange={(e) => handleInputChange('favs', e.target.value, 'girlsGeneration')}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.favs.girlsGeneration}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">AESPA:</label>
                  {isEditing ? (
                    <Input 
                      value={record.favs.aespa}
                      onChange={(e) => handleInputChange('favs', e.target.value, 'aespa')}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-white bg-gray-800 p-2 border border-gray-600">
                      {record.favs.aespa}
                    </div>
                  )}
                </div>

                <div>
                  <label className="field-label text-sm block mb-2 text-gray-300">CASUAL:</label>
                  {isEditing ? (
                    <Input 
                      value={record.favs.casual}
                      onChange={(e) => handleInputChange('favs', e.target.value, 'casual')}
                      className="font-mono bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="field-value font-mono text-sm text-white bg-gray-800 p-2 border border-gray-600">
                      {record.favs.casual}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Secciones detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gray-900 border-gray-700">
                <h4 className="field-label text-sm mb-3 text-white">#BVF:</h4>
                {isEditing ? (
                  <Textarea 
                    value={record.bvf}
                    onChange={(e) => handleInputChange('bvf', e.target.value)}
                    className="text-xs bg-gray-800 border-gray-600 text-gray-300 min-h-[100px]"
                  />
                ) : (
                  <div className="text-xs text-gray-300 leading-relaxed">{record.bvf}</div>
                )}
              </Card>

              <Card className="p-4 bg-gray-900 border-gray-700">
                <h4 className="field-label text-sm mb-3 text-white">#DFI:</h4>
                {isEditing ? (
                  <Textarea 
                    value={record.dfi}
                    onChange={(e) => handleInputChange('dfi', e.target.value)}
                    className="text-xs bg-gray-800 border-gray-600 text-gray-300 min-h-[100px]"
                  />
                ) : (
                  <div className="text-xs text-gray-300 leading-relaxed">{record.dfi}</div>
                )}
              </Card>

              <Card className="p-4 bg-gray-900 border-gray-700">
                <h4 className="field-label text-sm mb-3 text-white">#NON-KPOP:</h4>
                {isEditing ? (
                  <Textarea 
                    value={record.nonKpop}
                    onChange={(e) => handleInputChange('nonKpop', e.target.value)}
                    className="text-xs bg-gray-800 border-gray-600 text-gray-300 min-h-[100px]"
                  />
                ) : (
                  <div className="text-xs text-gray-300 leading-relaxed">{record.nonKpop}</div>
                )}
              </Card>
            </div>

            {/* Likes/Dislikes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gray-900 border-gray-700">
                <h4 className="field-label text-sm mb-3 text-green-400">LIKES</h4>
                {isEditing ? (
                  <Textarea 
                    value={record.likes}
                    onChange={(e) => handleInputChange('likes', e.target.value)}
                    className="text-sm bg-gray-800 border-gray-600 text-gray-300"
                  />
                ) : (
                  <div className="text-sm text-gray-300">{record.likes}</div>
                )}
              </Card>

              <Card className="p-4 bg-gray-900 border-gray-700">
                <h4 className="field-label text-sm mb-3 text-red-400">DISLIKES</h4>
                {isEditing ? (
                  <Textarea 
                    value={record.dislikes}
                    onChange={(e) => handleInputChange('dislikes', e.target.value)}
                    className="text-sm bg-gray-800 border-gray-600 text-gray-300"
                  />
                ) : (
                  <div className="text-sm text-gray-300">{record.dislikes}</div>
                )}
              </Card>
            </div>
          </div>

          {/* Columna derecha - Foto y huellas */}
          <div className="space-y-6">
            {/* Foto del sujeto */}
            <Card className="p-4 bg-gray-900 border-gray-700">
              <div className="aspect-[3/4] bg-gray-700 border-2 border-gray-600 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/lovable-uploads/0d09930b-522d-4b34-a48d-65ebd694dc3e.png"
                  alt="Criminal Photo"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <p className="text-sm text-white font-bold bg-black bg-opacity-70 px-2 py-1 rounded">FOTO DEL SUJETO</p>
                </div>
              </div>
            </Card>

            {/* Huellas dactilares */}
            <Card className="p-4 bg-gray-900 border-gray-700">
              <h4 className="field-label text-sm mb-4 flex items-center text-white">
                <Fingerprint className="w-4 h-4 mr-2" />
                FINGERTIPS...
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({length: 10}, (_, i) => (
                  <div key={i} className="aspect-square bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Card className="mt-6 p-4 text-center bg-gray-900 border-gray-700">
          <p className="text-sm text-gray-400 font-mono">( Made with Carrd )</p>
        </Card>
      </div>
    </div>
  );
};

export default CriminalRecordEditor;
