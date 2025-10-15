<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Exam;
use App\Models\Candidate;
use App\Models\Location;
use Carbon\Carbon;

class ExamScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // import example data
        $path = database_path('data/exam-schedule-data.json');
        $json = File::get($path);
        $exams = json_decode($json, true);

        foreach ($exams as $examData) {
            // check if location if not create
            $location = Location::firstOrCreate([
                'country' => $examData['location']['country'],
                'latitude' => $examData['location']['latitude'],
                'longitude' => $examData['location']['longitude'],
            ]);

            // fix wierd bug with seeder not liking date format from JSON
            $datetime = Carbon::parse($examData['datetime'])->format('Y-m-d H:i:s');

            // create an exam from json
            $exam = Exam::updateOrCreate(
                ['id' => $examData['ID']],
                [
                    'title' => $examData['title'],
                    'status' => $examData['status'],
                    'datetime' => $datetime,
                    'language' => $examData['language'],
                    'location_id' => $location->id,
                ]
            );

            //create candiates/link to exams
            $candidateIds = [];
            foreach ($examData['candidates'] as $candidateName) {
                $candidate = Candidate::firstOrCreate(['name' => $candidateName]);
                $candidateIds[] = $candidate->id;
            }

            $exam->candidates()->sync($candidateIds);
        }
    }
}
