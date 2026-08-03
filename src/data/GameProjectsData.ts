import ProjectData from '@/data/ProjectData.ts'

export default [
    new ProjectData("cpp-sokoban", "Sokoban", "img/projects/cpp-sokoban/super-mario-icons-square-yellow-box-with-question-mark-illustration-thumbnail.jpg", `
    <div class="paragraph">
        A <strong>Sokoban</strong> puzzle game I'm building solo in C++ with SDL3. Still unfinished, but the most technical project in this portfolio.
    </div>
    <div class="paragraph center">
        <video class="pc-video" controls preload="metadata">
            <source src="img/projects/cpp-sokoban/currentprogress.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="paragraph center">
        <h2>About this project</h2>
        Built solo, from scratch, in C++ with SDL3 — no engine underneath, so every system is one I wrote and can point to.<br/>
        Data-oriented instead of object-oriented: entities are flat structs in contiguous arrays, and what an entity can do is a bitmask instead of a class hierarchy.<br/>
        A custom memory arena backs every system, so nothing touches malloc or new once gameplay is actually running.<br/>
        Game logic lives in a hot-reloadable DLL, so most code changes apply while the game keeps running, no restart, no losing the level you were testing in.<br/>
        Started this to actually learn how computers and games work with memory, not just how to call new and hope the allocator sorts it out.<br/>
        Still unfinished: no win-state or level select yet, just the core push-box loop with undo/redo.
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Technical Overview</h2>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <pre><code>struct Arena
{
    unsigned char* base;
    size_t size;
    size_t used;
};

void* Allocate(Arena* arena, size_t size)
{
    void* front = arena-&gt;base + arena-&gt;used;
    arena-&gt;used += size;
    memset(front, 0, size);
    return front;
}

Arena* CreateSubArena(Arena* parent_arena, size_t size)
{
    Arena* sub_arena = (Arena*)Allocate(parent_arena, sizeof(Arena));
    void* memory_start = Allocate(parent_arena, size);
    Initialize(sub_arena, memory_start, size);
    return sub_arena;
}</code></pre>
                <p class="tech-caption">One block is malloc'd once at startup, and every system (images, levels, entities, commands) gets its own sub-arena bump-allocated out of it. Allocating is just moving a pointer forward, no malloc/new during gameplay, and freeing a whole subsystem's memory is a single Reset() instead of tracking individual object lifetimes.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>enum Behaviour : uint32_t
{
    NONE = 0,
    CAN_MOVE = 1 &lt;&lt; 0,
    IS_PLAYER = 1 &lt;&lt; 1,
    RESPOND_TO_INPUT = 1 &lt;&lt; 2
};

enum class ID : uint8_t
{
    NONE = 0,
    GROUND = 1,
    WALL = 2,
    PLAYER = 3,
    BOX = 4
};

struct Entity
{
    ID id;
    int x;
    int y;
    Behaviour behaviour;

    bool HasBehaviour(Behaviour flags)
    {
        return (behaviour &amp; flags) == flags;
    }

    void InitializeBaseBehaviour()
    {
        assert(id != ID::NONE);
        switch (id)
        {
            default:
                SetBehaviour(NONE);
                break;
            case ID::PLAYER:
                SetBehaviour((Behaviour)(CAN_MOVE | IS_PLAYER | RESPOND_TO_INPUT));
                break;
            case ID::BOX:
                SetBehaviour((Behaviour)CAN_MOVE);
                break;
        }
    }
};</code></pre>
                <p class="tech-caption">No Player class, no Box class, no base GameObject to inherit from. One Entity struct for everything, and what it's allowed to do is a bitmask assigned off its ID. Asking "can this thing move?" is a single AND against the flags, not a walk up a class hierarchy.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>bool LoadDLL(DLL_INFO* info, int depth = 0)
{
    if (depth &gt; 20)
    {
        printf("failed to write temp DLL");
        return false;
    }

    bool success = CopyFile(NAME_OF_DLL, NAME_OF_TEMP_DLL, false);
    if (!success)
    {
        Sleep(50);
        return LoadDLL(info, depth + 1);
    }

    info-&gt;dll = LoadLibrary(NAME_OF_TEMP_DLL);
    if (info-&gt;dll == nullptr)
    {
        printf("could not load DLL");
        return false;
    }

    info-&gt;initialize = (Function_Initialize)GetProcAddress(info-&gt;dll, NAME_OF_FUNC_INIT);
    info-&gt;update = (Function_Update)GetProcAddress(info-&gt;dll, NAME_OF_FUNC_UPDATE);
    info-&gt;draw = (Function_Draw)GetProcAddress(info-&gt;dll, NAME_OF_FUNC_DRAW);
    info-&gt;timestamp = GetTimestamp();
    return true;
}

void DLL_CheckStatus(DLL_INFO* dll)
{
    FILETIME timestamp = GetTimestamp();
    if (CompareFileTime(&amp;dll-&gt;timestamp, &amp;timestamp) != 0)
    {
        UnloadDLL(dll);
        LoadDLL(dll);
    }
}</code></pre>
                <p class="tech-caption">The executable is a thin shell that polls the game DLL's last-write time every frame. The instant it changes, the old library is unloaded and the freshly built one is copied in and loaded back, function pointers and all, so saving a code change is enough. The running game picks it up mid-level, no restart, no losing your place.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>void Push(CommandBuffer* buffer, AnyCommand cmd)
{
    buffer->allCommands[buffer->index] = cmd;
    buffer->index++;
    Execute(cmd);
}

void Undo(CommandBuffer* buffer)
{
    if (buffer->index == 0) return;
    buffer->index--;

    AnyCommand cmd = buffer->allCommands[buffer->index];
    switch (cmd.command.type)
    {
        case CMD_TYPE::MOVE:
            MoveCommand mv = cmd.move;
            mv.entity->x -= mv.xDir;
            mv.entity->y -= mv.yDir;
            break;
    }
}</code></pre>
                <p class="tech-caption">Every push is stored as data in a flat command buffer, not as a snapshot of the world. Undo doesn't restore a previous state, it just reverses the same delta it applied going forward, so the whole undo/redo stack is a handful of structs and an index instead of a growing pile of saved game states.</p>
            </div>
        </div>
    </div>
    `, "#E08E32", false, false),
    new ProjectData("drag-rush", "Drag Rush", "img/projects/project-8-icon.png", `
    <div class="paragraph">
        <strong>Drag Rush</strong> is a rhythm-action racing game set in a sci-fi universe of cosmic bloodsports.
    </div>
    <div class="paragraph">
        Get behind the wheel,<br/>
        Dodge incoming projectiles and obstacles,<br/>
        Go for gold and blow the competition offroad!<br/>
        <br/>
        The only rule?<br/>
        You gotta stick to the beat!
    </div>
    <div class="paragraph center">
        <iframe class="youtube" loading="lazy" src="https://www.youtube.com/embed/L5YWz2i434E" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC1.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC2.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC3.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC4.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC5.webp" alt="Drag Rush Screenshot" />
    </div>
    <div class="paragraph center">
        <h2>About this game</h2>
        Built in Unity (8 weeks).<br/>
        A team of 6 — 3 programmers, 3 artists.<br/>
        I mainly built the vehicle animation trees and helped finalize the Beat Conductor.<br/>
        Unique twist between a racing- and rhythm game.<br/>
        Fast-paced, satisfying and a "ok, one more try!" hook.
    </div>
    <div class="paragraph center">
        <a href="https://yrgo.itch.io/drag-rush" target="_blank" rel="noopener noreferrer"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Postmortem</h2>
        <div class="tech-overview-content">
            <div class="paragraph">
                <strong>Scope &amp; goals</strong><br/>
                The original pitch of Drag Rush was a rhythm / racing game where the player gets further up the leaderboard by defeating opponents. The original idea was that enemies would have different types of weapons the player would be able to pick up and switch between. This was cut due to scope — we felt somewhere along the line that it's more important to have one very satisfying weapon, rather than multiple weapons feeling "meh" and unbalanced.
            </div>
            <div class="paragraph">
                <strong>What went well?</strong><br/>
                The global beat conductor and a beat object were implemented from the very start and made a great foundation of the game. From that point, all objects that we wanted to follow the beat could easily inherit from the beat object interface and start to bounce on the beats we choose. 1/8, 1/4, 1/2 beats did not matter, the object would dance!
            </div>
            <div class="paragraph">
                <strong>What went wrong?</strong><br/>
                On week 6 we started to notice that the longer the game went on, the more the game went in and out of sync with the beat. Unity does not have any default BPM converter, so we had to build our own. It was difficult to decipher where the issue originated because of this. Finally we figured it out. After building a metronome helper function, and doing some more research, it basically came down to that we had to switch all our floats to doubles and start using dsp.Time to get a more precise count on the beats.
            </div>
            <div class="paragraph">
                <strong>Takeaways</strong><br/>
                This was my first ever real game project, not only in group, but overall as well. Previous to this, I had made a simple Snake Game in raylib, but that was it. We had learnt some basics in C# and Unity in previous lectures, but I was still really nervous that I was not going to be able to perform to the degree I wanted to. We were three programmers during this project, Billy and Elmer and me. Both of them had previous experience in programming, which was very comforting. This group project went as smooth as it could have for a group of programmer and artist newbies. We were very coordinated and everyone put their best foot forward and tried their absolute best to get this game to where we wanted. This project made my confidence in my programming and logical thinking skills grow a lot.
            </div>
        </div>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Technical Overview</h2>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <pre><code>void Update()
{
    if (!_running) return;

    double dspTime = AudioSettings.dspTime;

    if (dspTime &gt;= _nextBeatDspTime)
    {
        FireBeat(_nextBeatDspTime);
        _nextBeatDspTime += _beatInterval;
    }
}

public void StartMetronome(double bpm)
{
    _bpm = bpm;
    CalculateInterval();

    _currentBeatInBar = -1;
    _nextBeatDspTime = AudioSettings.dspTime + _beatInterval;
    _running = true;
}</code></pre>
                <p class="tech-caption">Scheduled beats against Unity's AudioSettings.dspTime instead of Time.deltaTime, so the beat clock stays locked to the audio hardware and can't drift out of sync with the music over time.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>IEnumerator DoLaneChange(int newLane, int dir)
{
    _isChangingLane = true;
    _bufferedDir = 0;

    // ...snap to lane, play turn animation, overshoot tween...

    _isChangingLane = false;

    if (_bufferedDir != 0)
    {
        int dirBuf = _bufferedDir;
        _bufferedDir = 0;
        ChangeLane(dirBuf);
    }
}</code></pre>
                <p class="tech-caption">A lane-change input received mid-animation is buffered and replayed once the current turn animation finishes. This keeps input feel responsive without letting animation state fall out of sync.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>public Tween OvershootTransform(Transform t, float laneX, int dir)
{
    KillActiveTween();

    Vector3 center = new Vector3(laneX, t.position.y, t.position.z);
    t.position = center;

    float goTime = _overshootDuration * 0.45f;
    float backTime = _overshootDuration - goTime;
    float overshootX = laneX + (_overshoot * Mathf.Sign(dir));

    Sequence seq = DOTween.Sequence().SetRecyclable(true);
    seq.Append(t.DOMoveX(overshootX, goTime).SetEase(Ease.OutQuad));
    seq.Append(t.DOMoveX(center.x, backTime).SetEase(Ease.InQuad));
    _activeTween = seq;
    return _activeTween;
}</code></pre>
                <p class="tech-caption">A two-stage tween (fast out, past the lane center and slower ease back in) gives the car a sense of momentum on transform position alone.</p>
            </div>
        </div>
    </div>
    `, "#6C3BAA", false, false),
    new ProjectData("dispater", "Dispater", "img/projects/dispater/DispaterSC4.png", `
    <div class="paragraph">
        <strong>"Good morning rookie!"</strong>
    </div>
    <div class="paragraph">
        Are you ready for your first day as the elevator operator at the D.I mining station. The station can be a bit cramped but you should have all you need to guide the rest of your crew through the mines. The Disparator Corporation welcomes you as the newest member of the Disparator family.
    </div>
    <div class="paragraph center">
        <iframe class="youtube" loading="lazy" src="https://www.youtube.com/embed/ihPEcIQ_PwI" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC1.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC2.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC3.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC4.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC5.webp" alt="Dispater Screenshot" />
    </div>
    <div class="paragraph center">
        <h2>About this game</h2>
        Made in Unreal Engine (8 weeks).<br/>
        A team of 7 — 3 programmers, 4 artists.<br/>
        I built the dialogue, task and interaction systems, and did the audio engineering.<br/>
        Heavy narrative.<br/>
        Custom made hexagonal gridbase movement.<br/>
        Atmospheric and creepy environment.<br/>
        Ending will leave you in SHOCK.
    </div>
    <div class="paragraph center">
        <a href="https://yrgo.itch.io/dispater" target="_blank" rel="noopener noreferrer"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Postmortem</h2>
        <div class="tech-overview-content">
            <div class="paragraph">
                <strong>Scope &amp; goals</strong><br/>
                The utmost goal of this project was to make a 3D game in Unreal Engine. We wanted to make a short, highly immersive and intense experience, which was more driven by narrative and story, rather than actual gameplay. Unfortunately, we had to chop a lot of story down, due to inexperience in scoping.
            </div>
            <div class="paragraph">
                <strong>What went well?</strong><br/>
                The atmosphere we were able to capture in Dispater, is in my opinion, amazing. We struggled with the lighting for sometime, but once we dove deeper and did the proper research on how to work with lighting in UE, it all came around massively. I built the task manager for this game, the engine driving the game forward, which became quite modular. Other objects could inherit the interface and become a taskable object, and be able to listen to previous tasks to know when to activate itself.
            </div>
            <div class="paragraph">
                <strong>What went wrong?</strong><br/>
                Even though the goal of the game was to make a short and impactful story, it was very difficult to produce just that. As I wrote earlier, a lot of story elements had to be tweaked or cut off from the final build, since we did not have enough time. One big takeaway for me is that if you are going to build a system that pretty much is carrying the game's core functions, build a debug system at the same time. If I had built a debug tool which had let me jump in and out of the story, where ever I pleased, it would have saved me A LOT of time. Iteration ate up a lot of days, and if I had figured this out earlier, the game could have become even better than it turned out.
            </div>
            <div class="paragraph">
                <strong>Takeaways</strong><br/>
                Audio and sound are a big passion of mine. I downloaded and used Reaper paired with UE's Metasounds. We knew that the audio would play a huge role in this game, but since none of us had made any music or audio for a game previously, we did not grasp how much time it would actually take. I wished that I could have at least one whole week only creating, tweaking, and mixing audio. But unfortunately, the inexperience in scoping properly struck again.
            </div>
        </div>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Technical Overview</h2>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <a href="img/projects/dispater/EnumForTasksSC.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot tech-bp-screenshot--compact" loading="lazy" src="img/projects/dispater/EnumForTasksSC.png" alt="Task definition struct" />
                </a>
                <p class="tech-caption">Every task is assembled from this one definition — prerequisite, target, ordered sub-steps and required components are all declared as data, so a new task is a new entry rather than another bespoke branch of logic.</p>
            </div>
            <div class="tech-snippet">
                <a href="img/projects/dispater/SnippetFromElevevatorTerminalSC_1.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot" loading="lazy" src="img/projects/dispater/SnippetFromElevevatorTerminalSC_1.png" alt="Elevator terminal action executor" />
                </a>
                <p class="tech-caption">The terminal walks the queued task one step at a time, translating each action value into the in-world effect it maps to. New kinds of step slot into the same switch instead of rewiring the flow that drives them.</p>
            </div>
            <div class="tech-snippet">
                <a href="img/projects/dispater/SnippetFromElevevatorTerminalSC.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot" loading="lazy" src="img/projects/dispater/SnippetFromElevevatorTerminalSC.png" alt="Prerequisite-gated interaction logic" />
                </a>
                <p class="tech-caption">A lever or button only responds if the task it belongs to is actually sitting in the current queue. That check is what keeps the sequence in order, so the station never has to physically lock anything away to stop a player skipping ahead.</p>
            </div>
        </div>
    </div>
    `, "#6C3BAA", false, false),
    new ProjectData("floor-0", "Floor Zero", "img/projects/project-7-icon.png", `
    <div class="paragraph">
        <strong>Floor Zero</strong> is an atmospheric exploration game set in a derelict underground facility. Navigate through abandoned corridors and discover the mysteries of what happened here.
    </div>
    <div class="paragraph center">
        <video class="pc-video" controls preload="metadata">
            <source src="img/projects/floor-0/Floor0vid2-web.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC1.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC2.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC3.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC4.webp" alt="Floor Zero Screenshot" />
    </div>
    <div class="paragraph center">
        <h2>About this game</h2>
        First solo project in Unreal Engine (5 weeks).<br/>
        Multi-state AI built with behaviour tree.<br/>
        Custom built Key/Lock and item system.<br/>
        Guaranteed no sleep for a week minimum.
    </div>
    <div class="paragraph center">
        <a href="https://juice-f.itch.io/floorzero" target="_blank" rel="noopener noreferrer"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Postmortem</h2>
        <div class="tech-overview-content">
            <div class="paragraph">
                <strong>Scope &amp; goals</strong><br/>
                Prior to this I had no experience on building a somewhat competent AI. I had just finished playing Resident Evil 9, and got inspired to making my own horror/action/survival-esque game. The one thing I really wanted to accomplish and deliver was a game where you are scared and chased by an entity, which you'd later get your revenge on for putting you through all that misery.
            </div>
            <div class="paragraph">
                <strong>What went well?</strong><br/>
                I built a modular interaction system which was extremely handy. After laying the ground work of the system, anything could basically be turned into an item to pick up. The keys, crowbar, hammer and of course, the AK-47.
            </div>
            <div class="paragraph">
                <strong>What went wrong?</strong><br/>
                The enemy AI can hear the player walking, but can also hear when the player either thuds a painting or vase in the level. Instead of just falling, I wanted to make these objects actually get destroyed. To get this done, I had to make a copy of the mesh (geometry collection) that would swap itself out with the original mesh in runtime. This was quite tricky and broke plenty of times. Either the object did not want to break or broke too early. After plenty of research, I finally made it work.
            </div>
            <div class="paragraph">
                <strong>Takeaways</strong><br/>
                During this project I really got to understand how blueprints work, and that they are not that far from your standard programming practice. I got to learn how interfaces work and the power they wield and the hierarchical structure of actors and components work.
            </div>
        </div>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Technical Overview</h2>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <a href="img/projects/floor-0/BT_Ghost.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot" loading="lazy" src="img/projects/floor-0/BT_Ghost.png" alt="Ghost AI behavior tree" />
                </a>
                <p class="tech-caption">One Selector at the root branches on a single Blackboard state value, so the Ghost&#39;s Roam, Chase, Follow, Attack, Lost and Death behaviours are all just states to switch between rather than conditions tangled across the tree.</p>
            </div>
            <div class="tech-snippet">
                <a href="img/projects/floor-0/BP_BaseInteractable.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot" loading="lazy" src="img/projects/floor-0/BP_BaseInteractable.png" alt="Base interactable object blueprint" />
                </a>
                <p class="tech-caption">A shared base actor owns the hover outline and the Interact-on-E path, both gated behind a valid-player-component check, so any actor inheriting from it becomes interactable without writing new logic.</p>
            </div>
            <div class="tech-snippet">
                <a href="img/projects/floor-0/BP_BaseDropable.png" target="_blank" rel="noopener noreferrer">
                    <img class="tech-bp-screenshot" loading="lazy" src="img/projects/floor-0/BP_BaseDropable.png" alt="Interactable target detection blueprint" />
                </a>
                <p class="tech-caption">A sphere trace gathers candidates first, then a line trace resolves which one the player actually means. Every hit is validated through the shared interactable interface, so aiming stays forgiving without ever grabbing something that was never interactable.</p>
            </div>
        </div>
    </div>
    `, "#6C3BAA", false, false),
    new ProjectData("swing-space", "SwingSpace", "img/projects/swing-space/SwingSpaceGIF.gif", `
    <div class="paragraph">
        Swing yourself up through space by grappling the planets. Get as far as you possible can and beat the highscore!
    </div>
    <div class="paragraph center">
        <video class="pc-video swing-space-video" controls preload="metadata">
            <source src="img/projects/swing-space/SwingSpaceVid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="paragraph center swing-space-shots">
        <img class="pc-screenshot swing-space-shot" loading="lazy" src="img/projects/swing-space/SwingSpaceSC1.webp" alt="SwingSpace Screenshot" />
        <img class="pc-screenshot swing-space-shot" loading="lazy" src="img/projects/swing-space/SwingSpaceSC2.webp" alt="SwingSpace Screenshot" />
    </div>
    <div class="paragraph center">
        <h2>About this game</h2>
        Built in Unity (5 weeks).<br/>
        My first solo project.<br/>
        Firebase integration for global highscore chart.<br/>
        Ported for mobile.<br/>
        Awesome, but also extremely fun.
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Postmortem</h2>
        <div class="tech-overview-content">
            <div class="paragraph">
                <strong>Scope &amp; goals</strong><br/>
                The goal of this project was to be able to create and build a smaller game for mobile. The first game that came to mind was OneMoreLine, which is basically what I based SwingSpace on.
            </div>
            <div class="paragraph">
                <strong>What went well?</strong><br/>
                Using Unity's built in DistanceJoint2D to grapple the planets with the calculated distance was something I implemented early on and stuck with the project all the way.
            </div>
            <div class="paragraph">
                <strong>What went wrong?</strong><br/>
                The base game was completed quite early on, which led me to think of what I could implement to make it more engaging. The answer: a leaderboard through Firebase. Firebase in itself was not that difficult to setup with all guides available on the official site by Google. However, to make the connection to Unity was very tedious and difficult to debug. In hindsight, I might have checked for other alternatives for a game this size.
            </div>
            <div class="paragraph">
                <strong>Takeaways</strong><br/>
                Relying on no one but oneself has its ups and downs. In my case, it became very apparent on what I prefer coding and what I procrastinate on doing. UI is not my favorite, and especially when not working with any artists. I felt that it became solely functionality based, rather than a mixture of function and art, which I much prefer working with.
            </div>
        </div>
    </div>
    <div class="tech-overview tech-overview--static">
        <h2 class="tech-overview-heading">Technical Overview</h2>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <pre><code>void FixedUpdate()
{
    Vector2 currentVelocity = _rb.linearVelocity;
    _rb.linearVelocity = currentVelocity.normalized * _constantSpeed;
    _rb.transform.up = _rb.linearVelocity;
}

void Attach(Rigidbody2D anchor)
{
    _isAttached = true;
    _currentAnchor = anchor;

    _joint = gameObject.AddComponent&lt;DistanceJoint2D&gt;();
    _joint.connectedBody = anchor;
    _joint.enableCollision = false;
    _joint.autoConfigureDistance = false;
    _joint.distance = (_rb.position - anchor.position).magnitude;

    _rb.linearDamping = 0f;
    _rb.angularDamping = 0f;
}</code></pre>
                <p class="tech-caption">Let Unity's DistanceJoint2D handle the swing arc naturally, but renormalized velocity to a constant magnitude every FixedUpdate so gravity and tension can't speed up or slow the swing. Keeps the feel consistent regardless of distance.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>void TryAttachNearest()
{
    Collider2D[] hits = Physics2D.OverlapCircleAll(_rb.position, _searchRadius, _anchorLayer);

    Rigidbody2D closestAnchor = null;
    float closestSquaredDistance = float.PositiveInfinity;

    foreach (Collider2D hit in hits)
    {
        float squaredDistance = (hit.attachedRigidbody.position - _rb.position).sqrMagnitude;
        if (squaredDistance &lt; closestSquaredDistance)
        {
            closestSquaredDistance = squaredDistance;
            closestAnchor = hit.attachedRigidbody;
        }
    }

    if (closestAnchor != null)
    {
        Attach(closestAnchor);
        AudioSource.PlayClipAtPoint(_grappleSound, transform.position);
    }
}</code></pre>
                <p class="tech-caption">A layer-filtered overlap query plus squared-distance comparison, keeps grapple targeting forgiving and balanced. The player only has to be roughly aimed at an anchor, not pixel-perfect.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>public event Action&lt;float&gt; OnHeightChanged;
public event Action OnPlayerDeath;

void Start()
{
    // Register this Player with observers
    if (ScoreManager.Instance != null)
        ScoreManager.Instance.SubscribeToPlayerEvents();
    if (FirebaseTest.Instance != null)
        FirebaseTest.Instance.SubscribeToPlayerEvents();
}

public bool PlayerDeath()
{
    if (isKillable == true)
    {
        OnPlayerDeath?.Invoke();
        Destroy(gameObject);
        GameManager.Instance.IsPlayerDead(true);
        AudioSource.PlayClipAtPoint(_deathSFX, transform.position);
        return true;
    }
    return false;
}</code></pre>
                <p class="tech-caption">Player broadcasts height/death via C# events. ScoreManager and the Firebase leaderboard subscribe independently, so scoring stays decoupled from player logic.</p>
            </div>
        </div>
    </div>
    `, "#6C3BAA", false, false)
];