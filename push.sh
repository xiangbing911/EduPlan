#!/bin/bash
cd ~/work/EduPlan
git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/xiangbing911/EduPlan.git
git push -u origin main
