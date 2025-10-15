<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = ['title', 'status', 'datetime', 'language', 'location_id'];
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class)->withTimestamps();
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}   