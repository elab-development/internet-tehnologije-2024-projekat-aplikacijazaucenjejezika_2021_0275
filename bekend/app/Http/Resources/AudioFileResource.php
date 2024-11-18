<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AudioFileResource extends JsonResource
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
            'putanja' => $this->putanja,
            'lekcija' => new LessonResource($this->lekcija), 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}