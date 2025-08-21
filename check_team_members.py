from app import app, db
from Backend.models.content import TeamMember

with app.app_context():
    # Check all team members
    team_members = TeamMember.query.all()
    print(f"Total team members: {len(team_members)}")
    
    for member in team_members:
        print(f"Member: {member.name}, Position: {member.position}, Is Active: {member.is_active}")
