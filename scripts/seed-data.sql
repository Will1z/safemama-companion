-- SafeMama Companion Seed Data
-- This script populates the database with initial data for education topics, daily tips, and communities

-- Education Topics
INSERT INTO education_topics (slug, trimester, title, summary, content, tags) VALUES
-- First Trimester Topics
('early-pregnancy-symptoms', 1, 'Early Pregnancy Symptoms', 'Understanding common early pregnancy changes and when to seek help', 'Early pregnancy brings many changes to your body. Common symptoms include:

• Nausea and morning sickness
• Fatigue and tiredness
• Breast tenderness
• Frequent urination
• Food aversions or cravings

These symptoms are normal and usually improve after the first trimester. However, if you experience severe nausea, dehydration, or any concerning symptoms, contact your healthcare provider.

Remember: Every pregnancy is different, and not everyone experiences the same symptoms.', ARRAY['symptoms', 'first trimester', 'normal changes']),

('prenatal-vitamins', 1, 'Prenatal Vitamins and Nutrition', 'Essential nutrients for a healthy pregnancy from the start', 'Taking prenatal vitamins is important for your baby''s development. Key nutrients include:

• Folic acid (400-800 mcg daily) - prevents neural tube defects
• Iron - supports increased blood volume
• Calcium - builds strong bones and teeth
• Vitamin D - helps with calcium absorption
• DHA - supports brain development

Start taking prenatal vitamins as soon as you know you''re pregnant, or even before if you''re planning to conceive. Choose a vitamin that contains at least 400 mcg of folic acid.

Always take vitamins with food to reduce nausea, and talk to your doctor about the best option for you.', ARRAY['nutrition', 'vitamins', 'folic acid', 'health']),

('first-trimester-care', 1, 'First Trimester Care', 'Essential care tips for the first 13 weeks of pregnancy', 'The first trimester is a crucial time for your baby''s development. Here''s how to take care of yourself:

**Medical Care:**
• Schedule your first prenatal visit
• Start taking prenatal vitamins
• Avoid alcohol, smoking, and drugs
• Limit caffeine to 200mg per day

**Lifestyle:**
• Get plenty of rest
• Eat small, frequent meals
• Stay hydrated
• Exercise moderately (with doctor approval)

**When to Call Your Doctor:**
• Severe nausea or vomiting
• Heavy bleeding
• Severe abdominal pain
• High fever

Remember: It''s normal to feel tired and emotional during this time. Be patient with yourself.', ARRAY['care', 'first trimester', 'medical care', 'lifestyle']),

('pregnancy-anxiety', 1, 'Managing Pregnancy Anxiety', 'Coping with worries and stress during early pregnancy', 'Feeling anxious during pregnancy is completely normal. Here are some strategies to help:

**Common Worries:**
• Fear of miscarriage
• Concerns about baby''s health
• Financial stress
• Relationship changes

**Coping Strategies:**
• Talk to your partner, friends, or family
• Practice relaxation techniques
• Stay informed but avoid excessive googling
• Join a support group
• Consider counseling if anxiety is severe

**When to Seek Help:**
• Persistent worry that affects daily life
• Panic attacks
• Depression symptoms
• Inability to sleep or eat

Remember: It''s okay to ask for help. Your mental health is important for both you and your baby.', ARRAY['mental health', 'anxiety', 'stress', 'support']),

-- Second Trimester Topics
('second-trimester-changes', 2, 'Second Trimester Changes', 'What to expect as your pregnancy progresses', 'The second trimester (weeks 14-27) is often called the "honeymoon period" of pregnancy. Here''s what to expect:

**Physical Changes:**
• Increased energy levels
• Growing belly and weight gain
• Baby movements (quickening)
• Breast changes
• Skin changes (linea nigra, stretch marks)

**Common Symptoms:**
• Heartburn and indigestion
• Back pain
• Leg cramps
• Nasal congestion
• Round ligament pain

**What''s Happening with Baby:**
• Rapid growth and development
• Formation of major organs
• Development of senses
• Regular sleep-wake cycles

This is a great time to enjoy your pregnancy and prepare for your baby''s arrival.', ARRAY['second trimester', 'changes', 'development', 'symptoms']),

('pregnancy-exercise', 2, 'Safe Exercise During Pregnancy', 'Staying active and healthy throughout your pregnancy', 'Exercise during pregnancy has many benefits for both you and your baby:

**Benefits:**
• Improved mood and energy
• Better sleep
• Reduced back pain
• Easier labor and delivery
• Faster postpartum recovery

**Safe Exercises:**
• Walking
• Swimming
• Prenatal yoga
• Low-impact aerobics
• Stationary cycling

**Exercises to Avoid:**
• Contact sports
• Activities with high fall risk
• Exercises lying flat on your back (after 16 weeks)
• Scuba diving
• Hot yoga or hot Pilates

**Guidelines:**
• Aim for 150 minutes of moderate exercise per week
• Listen to your body
• Stay hydrated
• Stop if you feel dizzy or short of breath

Always check with your healthcare provider before starting any exercise program.', ARRAY['exercise', 'fitness', 'health', 'safety']),

('baby-movements', 2, 'Understanding Baby Movements', 'What to expect and when to be concerned', 'Feeling your baby move is one of the most exciting parts of pregnancy:

**When You''ll Feel Movement:**
• First-time moms: 18-25 weeks
• Experienced moms: 16-20 weeks
• Initially feels like flutters or bubbles
• Becomes stronger and more regular over time

**Normal Patterns:**
• More active in the evening
• Responds to sounds and touch
• Has sleep-wake cycles
• Movement increases until 32 weeks

**Kick Counting (after 28 weeks):**
• Count movements for 1 hour
• Should feel at least 10 movements
• Do this at the same time daily
• Choose when baby is usually active

**When to Call Your Doctor:**
• No movement for 2 hours
• Significant decrease in movement
• Any concerns about baby''s activity

Trust your instincts - you know your baby best!', ARRAY['baby movements', 'kick counting', 'monitoring', 'development']),

-- Third Trimester Topics
('third-trimester-preparation', 3, 'Third Trimester Preparation', 'Getting ready for labor, delivery, and baby''s arrival', 'The third trimester (weeks 28-40) is all about preparation:

**Medical Preparation:**
• More frequent prenatal visits
• Group B strep test
• Final ultrasounds
• Birth plan discussion
• Hospital tour

**Physical Preparation:**
• Pelvic floor exercises
• Perineal massage
• Comfort measures for labor
• Breathing techniques
• Positioning for labor

**Practical Preparation:**
• Pack hospital bag
• Install car seat
• Set up nursery
• Stock up on essentials
• Arrange help for after birth

**Emotional Preparation:**
• Address fears and concerns
• Practice relaxation techniques
• Connect with support system
• Prepare for postpartum period

Remember: You''re almost there! Take time to rest and prepare.', ARRAY['third trimester', 'preparation', 'labor', 'delivery']),

('labor-signs', 3, 'Signs of Labor', 'Recognizing when labor begins and what to do', 'Knowing the signs of labor helps you feel prepared and confident:

**Early Labor Signs:**
• Regular contractions that get stronger
• Lower back pain
• Bloody show (mucus plug)
• Water breaking
• Nesting instinct

**True vs. False Labor:**
• True labor: contractions get stronger, closer together, and don''t stop with rest
• False labor: irregular contractions that stop with position changes or rest

**When to Go to Hospital:**
• Contractions 5 minutes apart for 1 hour
• Water breaks
• Heavy bleeding
• Severe pain
• Decreased baby movement

**What to Do:**
• Stay calm and breathe
• Time contractions
• Call your healthcare provider
• Go to hospital when instructed
• Trust your instincts

Remember: Every labor is different. Don''t compare your experience to others.', ARRAY['labor', 'contractions', 'delivery', 'hospital']),

('postpartum-planning', 3, 'Postpartum Planning', 'Preparing for life after baby arrives', 'Planning for the postpartum period helps ensure a smoother transition:

**Physical Recovery:**
• Expect 6-8 weeks for full recovery
• Vaginal bleeding (lochia) for 2-6 weeks
• Breast engorgement and soreness
• Perineal care and healing
• Hormonal changes and mood swings

**Emotional Support:**
• Baby blues (first 2 weeks)
• Postpartum depression awareness
• Support system planning
• Self-care strategies
• Professional help resources

**Practical Planning:**
• Meal preparation and freezing
• Help with household tasks
• Childcare for older children
• Pet care arrangements
• Financial planning

**Baby Care:**
• Feeding plan (breastfeeding or formula)
• Sleep arrangements
• Pediatrician selection
• Newborn care basics
• Safety considerations

Remember: It''s okay to ask for help. You don''t have to do everything alone.', ARRAY['postpartum', 'recovery', 'planning', 'support']),

('breastfeeding-basics', 3, 'Breastfeeding Basics', 'Getting started with breastfeeding your newborn', 'Breastfeeding provides optimal nutrition for your baby and has benefits for you too:

**Benefits:**
• Perfect nutrition for baby
• Antibodies and immune protection
• Bonding and comfort
• Convenient and cost-effective
• Health benefits for mom

**Getting Started:**
• Skin-to-skin contact immediately after birth
• Feed on demand (8-12 times per day)
• Watch for hunger cues
• Ensure proper latch
• Seek help early if needed

**Common Challenges:**
• Sore nipples
• Engorgement
• Low milk supply concerns
• Latching difficulties
• Sleep deprivation

**Getting Help:**
• Lactation consultants
• Breastfeeding support groups
• Online resources
• Healthcare providers
• Family and friends

**Remember:**
• Every breastfeeding journey is unique
• It''s okay to supplement if needed
• Fed is best
• Take care of yourself too

Don''t hesitate to ask for help - breastfeeding is a learned skill for both you and your baby.', ARRAY['breastfeeding', 'newborn', 'feeding', 'nutrition']),

('newborn-care', 3, 'Newborn Care Essentials', 'Basic care tips for your new baby', 'Caring for a newborn can feel overwhelming, but you''ll learn quickly:

**Daily Care:**
• Feeding every 2-3 hours
• Diaper changes (8-12 per day)
• Bathing 2-3 times per week
• Nail trimming
• Umbilical cord care

**Sleep Safety:**
• Back to sleep
• Firm mattress
• No loose bedding
• Room sharing, not bed sharing
• Avoid overheating

**Health Monitoring:**
• Temperature taking
• Recognizing illness signs
• When to call pediatrician
• Vaccination schedule
• Growth tracking

**Comforting Techniques:**
• Swaddling
• White noise
• Rocking and movement
• Pacifiers
• Skin-to-skin contact

**Self-Care:**
• Accept help from others
• Sleep when baby sleeps
• Eat regularly
• Stay hydrated
• Connect with other parents

Remember: You''re learning together. Trust your instincts and don''t be afraid to ask questions.', ARRAY['newborn', 'baby care', 'safety', 'health']);

-- Daily Tips
INSERT INTO daily_tips (trimester, risk_tags, message, source, locale) VALUES
-- First Trimester Tips
(1, ARRAY[]::text[], 'If you feel dizzy, sit down and sip water. This is common in early pregnancy.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Small, frequent meals can help with nausea. Try crackers or dry toast first thing in the morning.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Rest when you need to. Your body is working hard to grow your baby.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Stay hydrated by drinking water throughout the day. Aim for 8-10 glasses daily.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Take your prenatal vitamins with food to reduce nausea.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'If you have heavy bleeding or severe headache, go to a clinic now.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Gentle walks can help with fatigue and improve your mood.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Avoid foods that make you feel sick. Your appetite will return later.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Wear comfortable, loose clothing as your body changes.', 'SafeMama Team', 'en'),
(1, ARRAY[]::text[], 'Talk to your partner about how you''re feeling. Communication is important.', 'SafeMama Team', 'en'),

-- Second Trimester Tips
(2, ARRAY[]::text[], 'You might feel more energetic now. Enjoy this "honeymoon period" of pregnancy.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Start feeling for baby movements around 18-20 weeks. It feels like flutters at first.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Sleep on your side, especially your left side, for better blood flow to baby.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Continue taking prenatal vitamins and eating a balanced diet.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Gentle exercise like walking or swimming can help with back pain.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Your growing belly might cause heartburn. Eat smaller meals more often.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Start thinking about your birth plan and discussing it with your healthcare provider.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Wear supportive shoes and avoid high heels as your center of gravity changes.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Stay hydrated and eat fiber-rich foods to prevent constipation.', 'SafeMama Team', 'en'),
(2, ARRAY[]::text[], 'Take time to bond with your baby by talking or singing to your belly.', 'SafeMama Team', 'en'),

-- Third Trimester Tips
(3, ARRAY[]::text[], 'Pack your hospital bag by 36 weeks. You never know when baby will arrive!', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Count baby kicks daily. You should feel at least 10 movements in 1 hour.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Practice breathing exercises and relaxation techniques for labor.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Install your car seat and have it checked by a certified technician.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Rest when you can. You''ll need your energy for labor and delivery.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Eat dates in the last few weeks - they may help with labor preparation.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Stay active with gentle exercise, but listen to your body.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Prepare freezer meals for the first few weeks after baby arrives.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'If you have contractions 5 minutes apart for 1 hour, go to the hospital.', 'SafeMama Team', 'en'),
(3, ARRAY[]::text[], 'Trust your instincts. You know your body and your baby best.', 'SafeMama Team', 'en'),

-- Condition-specific tips
(1, ARRAY['anemia'], 'If you have anemia, eat iron-rich foods like lean meat, spinach, and beans.', 'SafeMama Team', 'en'),
(2, ARRAY['anemia'], 'Take iron supplements with vitamin C to help absorption. Avoid taking with dairy.', 'SafeMama Team', 'en'),
(3, ARRAY['anemia'], 'Continue iron supplements as prescribed. Anemia can affect your energy during labor.', 'SafeMama Team', 'en'),
(1, ARRAY['hypertension'], 'Monitor your blood pressure regularly. Report any high readings to your doctor.', 'SafeMama Team', 'en'),
(2, ARRAY['hypertension'], 'Limit salt intake and stay hydrated. Rest with your feet elevated when possible.', 'SafeMama Team', 'en'),
(3, ARRAY['hypertension'], 'Watch for signs of preeclampsia: severe headache, vision changes, or swelling.', 'SafeMama Team', 'en'),
(1, ARRAY['diabetes'], 'Monitor your blood sugar as directed by your healthcare provider.', 'SafeMama Team', 'en'),
(2, ARRAY['diabetes'], 'Eat regular, balanced meals to help maintain stable blood sugar levels.', 'SafeMama Team', 'en'),
(3, ARRAY['diabetes'], 'Continue monitoring blood sugar. Good control is important for a healthy delivery.', 'SafeMama Team', 'en');

-- Micro Communities
INSERT INTO micro_communities (title, region, trimester) VALUES
('Trimester 1 Nigeria', 'Nigeria', 1),
('Trimester 1 Kenya', 'Kenya', 1),
('Trimester 1 Ghana', 'Ghana', 1),
('Trimester 2 Nigeria', 'Nigeria', 2),
('Trimester 2 Kenya', 'Kenya', 2),
('Trimester 2 Ghana', 'Ghana', 2),
('Trimester 3 Nigeria', 'Nigeria', 3),
('Trimester 3 Kenya', 'Kenya', 3),
('Trimester 3 Ghana', 'Ghana', 3);
