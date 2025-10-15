<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['country', 'latitude', 'longitude'];

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}