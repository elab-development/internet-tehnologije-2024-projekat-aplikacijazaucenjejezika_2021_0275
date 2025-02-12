<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'tekst' => $this->tekst,
            'predjena' => $this->predjena,
            'language' => new LanguageResource($this->jezik), 
            'audio_files' => AudioFileResource::collection($this->audioFajlovi), 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'files' => $this->files->map(function ($file) {
                return [
                    'name' => $file->name,
                    'path' => $file->path,
                ];
            }),
        ];
    }
}
